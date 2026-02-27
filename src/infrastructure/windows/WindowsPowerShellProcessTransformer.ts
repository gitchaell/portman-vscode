import { Process } from '@/domain/Process';
import { ProcessTransformer } from '@/domain/ProcessTransformer';

export class WindowsPowerShellProcessTransformer implements ProcessTransformer {
	regExp = {
		newLine: '\n',
		separator: /\s+/,
	};

	transform(input: string): Process[] {
		// Output format from: Get-NetTCPConnection -State Listen | Select-Object -Property LocalAddress,LocalPort,OwningProcess
		//
		// LocalAddress LocalPort OwningProcess
		// ------------ --------- -------------
		// ::                   22          1388
		// 0.0.0.0              22          1388
		// 127.0.0.1         53545         10828

		const lines = input.trim().split(this.regExp.newLine);
		const processes: Process[] = [];

		let dataStarted = false;

		for (const line of lines) {
			const parts = line.trim().split(this.regExp.separator);

			if (!dataStarted) {
				// Skip until we see the dashed line
				if (parts.length > 0 && parts[0].startsWith('--')) {
					dataStarted = true;
				}
				continue;
			}

			if (parts.length < 3) continue;

			const localHost = parts[0];
			const localPort = parts[1];
			const pid = parts[2];

			if (!pid || !localPort || !localHost) {
				continue;
			}

			if (isNaN(+localPort)) {
				continue;
			}

			processes.push(
				Process.fromPrimitives({
					id: pid,
					program: '-', // PowerShell doesn't give program name easily in this specific command without more complex joining
					protocol: 'tcp',
					localHost,
					localPort,
					remoteHost: '-',
					remotePort: '-',
					status: 'LISTENING',
				}),
			);
		}

		return this.sort(processes);
	}

	sort(processes: Process[]): Process[] {
		return processes.sort((a, b) => +a.local.port.value - +b.local.port.value);
	}
}
