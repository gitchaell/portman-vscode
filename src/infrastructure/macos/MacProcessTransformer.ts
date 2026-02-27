import { Process } from '@/domain/Process';
import { ProcessTransformer } from '@/domain/ProcessTransformer';

export class MacProcessTransformer implements ProcessTransformer {
    regExp = {
        newLine: '\n',
        separator: /\s+/, // lsof output is space separated
        port: /:(\d{1,5}|\*)$/,
    };

    transform(input: string): Process[] {
        // Input example:
        // COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME
        // python3 2258 jules 3u IPv4 9905 0t0 TCP *:8080 (LISTEN)

        const lines = input.split(this.regExp.newLine);
        const processes: Process[] = [];

        for (const line of lines) {
            const parts = line.trim().split(this.regExp.separator);

            // We expect at least 9 or 10 columns depending on the output
            // COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME
            // python3 2258 jules 3u IPv4 9905 0t0 TCP *:8080 (LISTEN)
            // 0       1    2     3  4    5    6   7   8   9

            if (parts.length < 9) continue;

            // Check if it's the header line
            if (parts[0] === 'COMMAND' && parts[1] === 'PID') continue;

            const program = parts[0];
            const pid = parts[1];
            const protocol = parts[7].toLowerCase(); // TCP
            const address = parts[8]; // *:8080
            const statusRaw = parts[9]; // (LISTEN)

            const status = statusRaw ? statusRaw.replace(/[()]/g, '') : 'LISTEN';

            // Parse address (similar to Linux/Windows)
            const [localHost, localPort] = this.parseAddress(address);

            // lsof doesn't always show remote address easily in the same line for LISTEN sockets
            // For LISTEN sockets, remote is usually *:* or 0.0.0.0:*
            const remoteHost = '*';
            const remotePort = '*';

             if (
                !pid ||
                !program ||
                !localPort ||
                !localHost ||
                !status
            ) {
                continue;
            }

            if (isNaN(+localPort)) {
                continue;
            }

            processes.push(
                Process.fromPrimitives({
                    id: pid,
                    program,
                    protocol,
                    localHost,
                    localPort,
                    remoteHost,
                    remotePort,
                    status,
                })
            );
        }

        return this.sort(processes);
    }

    sort(processes: Process[]): Process[] {
        return processes.sort((a, b) => +a.local.port.value - +b.local.port.value);
    }

    parseAddress(address: string): [string, string] | [] {
        // *:8080 or localhost:8080 or 127.0.0.1:8080
        const lastColonIndex = address.lastIndexOf(':');
        if (lastColonIndex === -1) return [];

        const host = address.substring(0, lastColonIndex);
        const port = address.substring(lastColonIndex + 1);

        return [host, port];
    }
}
