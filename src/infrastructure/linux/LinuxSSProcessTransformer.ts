import { Process } from '@/domain/Process';
import { ProcessTransformer } from '@/domain/ProcessTransformer';

export class LinuxSSProcessTransformer implements ProcessTransformer {
	regExp = {
		port: /:(\d{1,5}|\*)$/,
		// ss output format can vary. Usually:
		// State Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
		// LISTEN 0      0      0.0.0.0:22        0.0.0.0:*
		// With -p:
		// LISTEN 0      0      0.0.0.0:22        0.0.0.0:*      users:(("sshd",pid=123,fd=3))
		separator: /\s+/,
		newLine: '\n',
	};

	transform(input: string): Process[] {
		const lines = input.split(this.regExp.newLine);
		const processes: Process[] = [];

		for (const line of lines) {
			const parts = line.trim().split(this.regExp.separator);

			// We need at least 5 columns for basic ss output
			// State Recv-Q Send-Q Local Peer
			// LISTEN 0 0 0.0.0.0:22 0.0.0.0:* users:(("sshd",pid=123,fd=3))
			// 0      1 2 3          4         5

			if (parts.length < 5) {
				continue;
			}
			if (parts[0] === 'State' || parts[0] === 'Netid') {
				continue;
			}

			// Check if it's a listening socket
			const state = parts[0];
			if (state !== 'LISTEN') {
				continue;
			}

			const localAddress = parts[3];
			const remoteAddress = parts[4];
			const processInfo = parts.slice(5).join(' '); // Capture the rest as process info

			const [localHost, localPort] = this.parseAddress(localAddress);
			const [remoteHost, remotePort] = this.parseAddress(remoteAddress);

			// Parse process info from ss output
			// users:(("sshd",pid=123,fd=3))
			const [pid, program] = this.parseProcess(processInfo);

			if (!localPort || !localHost) {
				continue;
			}
			if (isNaN(+localPort)) {
				continue;
			}

			// If no PID found, we might still want to list it as unknown owner?
			// The original code skipped if no PID/Program. I'll stick to that behavior or similar.
			// But ss might not show users if not root.
			// If pid is missing, we can default to '-' or skip.
			// The original code skipped.

			// If we want to show even if unknown, we can set default values.
			// But for now let's try to be consistent with existing logic.

			const validPid = pid || '-';
			const validProgram = program || '-';

			processes.push(
				Process.fromPrimitives({
					id: validPid,
					program: validProgram,
					protocol: 'tcp', // ss default with -t is tcp
					localHost,
					localPort,
					remoteHost: remoteHost || '-',
					remotePort: remotePort || '-',
					status: state,
				}),
			);
		}

		return this.sort(processes);
	}

	sort(processes: Process[]): Process[] {
		return processes.sort((a, b) => +a.local.port.value - +b.local.port.value);
	}

	parseAddress(address: string): [string, string] | [] {
		const result = this.regExp.port.exec(address);
		if (!result) {
			return [];
		}
		const [match, port] = result;
		const host = address.replace(match, '');
		return [host, port];
	}

	parseProcess(info: string): [string, string] | [] {
		// users:(("sshd",pid=123,fd=3))
		// Regex to extract program and pid
		// "(\w+)",pid=(\d+)
		const match = /"([^"]+)",pid=(\d+)/.exec(info);
		if (match) {
			return [match[2], match[1]];
		}
		return [];
	}
}
