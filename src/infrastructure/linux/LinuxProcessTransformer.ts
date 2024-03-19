import { Process } from '@/domain/Process';
import { ProcessTransformer } from '@/domain/ProcessTransformer';

export class LinuxProcessTransformer implements ProcessTransformer {
	regExp = {
		port: /:(\d{1,5}|\*)$/,
		process: /(\d+)\/(.+)/,
		separator: '(|)',
		newLine: '\n',
	};

	transform(input: string): Process[] {
		const lines = input.split(this.regExp.newLine).splice(2);

		const processes: Process[] = [];

		for (const line of lines) {
			const parts = line.trim().split(this.regExp.separator);

			const [protocol, , , localAddress, remoteAddress, status, process] =
				parts;

			const [id, program] = this.parseProcess(process);
			const [localHost, localPort] = this.parseAddress(localAddress);
			const [remoteHost, remotePort] = this.parseAddress(remoteAddress);

			if (
				!id ||
				!program ||
				!localPort ||
				!localHost ||
				!remotePort ||
				!remoteHost ||
				!status
			) {
				continue;
			}

			if (isNaN(+localPort)) {
				continue;
			}

			processes.push(
				Process.fromPrimitives({
					id,
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
		const result = this.regExp.port.exec(address);

		if (!result) {
			return [];
		}

		const [match, port] = result;

		const host = address.replace(match, '');

		return [host, port];
	}

	parseProcess(process: string): [string, string] | [] {
		const result = this.regExp.process.exec(process);

		if (!result) {
			return [];
		}

		const [, pid, program] = result;

		return [pid, program];
	}
}
