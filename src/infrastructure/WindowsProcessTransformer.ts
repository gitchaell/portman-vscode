import { Process } from '../domain/Process';
import { ProcessTransformer } from '../domain/ProcessTransformer';

export class WindowsProcessTransformer implements ProcessTransformer {
	regExp = {
		port: /:(\d{1,5}|\*)$/,
		process: /(\d+)\/(.+)/,
		separator: /\s+/,
		newLine: '\n',
	};

	transform(input: string): Process[] {
		const lines = input.split(this.regExp.newLine);

		const processes: Process[] = [];

		for (const line of lines) {
			const parts = line.trim().split(this.regExp.separator);

			const [protocol, localAddress, remoteAddress, status, id] = parts;

			const [localHost, localPort] = this.parseAddress(localAddress);
			const [remoteHost, remotePort] = this.parseAddress(remoteAddress);

			if (
				!id ||
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
					program: 'UNKNOWN',
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
}
