import { Process } from '@/domain/Process';
import { ProcessTransformer } from '@/domain/ProcessTransformer';

export class MacNetstatProcessTransformer implements ProcessTransformer {
	regExp = {
		newLine: '\n',
		separator: /\s+/, // netstat output is space separated
		port: /\.([^.]+)$/, // macOS netstat uses dot for port, e.g., 127.0.0.1.8080
	};

	transform(input: string): Process[] {
		// Input example:
		// tcp4       0      0  127.0.0.1.8080         *.*                    LISTEN
		const lines = input.split(this.regExp.newLine);
		const processes: Process[] = [];

		for (const line of lines) {
			const parts = line.trim().split(this.regExp.separator);

			// Expected format for netstat -anv | grep LISTEN
			// tcp4       0      0  127.0.0.1.8080         *.*                    LISTEN      -
			if (parts.length < 6) continue;

			const protocolRaw = parts[0];
			if (!protocolRaw.startsWith('tcp') && !protocolRaw.startsWith('udp')) continue;

			const protocol = protocolRaw.startsWith('tcp') ? 'tcp' : 'udp';
			const address = parts[3]; // 127.0.0.1.8080 or *.8080
			const status = parts[5]; // LISTEN

			if (status !== 'LISTEN' && status !== 'LISTENING') continue;

			const [localHost, localPort] = this.parseAddress(address);

			const remoteHost = '*';
			const remotePort = '*';

			// netstat on mac without sudo doesn't usually show PID easily in this output
			// or it shows it later. We can just use a placeholder if not found.
			// Some formats of -anv -p tcp have PID in later columns.
			// tcp4       0      0 127.0.0.1.8080         *.*                    LISTEN      -
			// It might have '-' or '1234/program'

			let pid = '-';
			let program = '-';

			if (parts.length > 8 && parts[8] !== '-') {
				const processInfo = parts[8]; // e.g., "1234/java"
				const splitIndex = processInfo.indexOf('/');
				if (splitIndex !== -1) {
					pid = processInfo.substring(0, splitIndex);
					program = processInfo.substring(splitIndex + 1);
				} else {
					pid = processInfo;
				}
			}

			if (!localPort || !localHost) continue;
			if (isNaN(+localPort)) continue;

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
				}),
			);
		}

		return this.sort(processes);
	}

	sort(processes: Process[]): Process[] {
		return processes.sort((a, b) => +a.local.port.value - +b.local.port.value);
	}

	parseAddress(address: string): [string, string] | [] {
		// macOS netstat format: 127.0.0.1.8080 or *.8080 or :::8080

		// If it's an IPv6 address like :::22, the port is the last part after colon
		if (address.includes(':')) {
			const parts = address.split(':');
			const port = parts.pop();
			const host = parts.join(':') || '*';
			return [host, port || ''];
		}

		const match = this.regExp.port.exec(address);
		if (!match) return [];

		const port = match[1];
		const host = address.substring(0, address.length - match[0].length);

		return [host || '*', port];
	}
}
