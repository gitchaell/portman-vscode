import { AggregateRoot } from '@/shared/domain/AggregateRoot';
import { ProcessId } from './ProcessId';
import { ProcessProgram } from './ProcessProgram';
import { ProcessStatus } from './ProcessStatus';
import { Protocol } from './Protocol';
import { Address } from './Address';
import { AddressHost } from './AddressHost';
import { AddressPort } from './AddressPort';

export class Process extends AggregateRoot {
	static fromPrimitives(process: {
		id: string;
		program: string;
		protocol: string;
		localHost: string;
		localPort: string;
		remoteHost: string;
		remotePort: string;
		status: string;
	}): Process {
		return new Process(
			new ProcessId(process.id),
			new ProcessProgram(process.program),
			new Protocol(process.protocol),
			new Address(
				new AddressHost(process.localHost),
				new AddressPort(process.localPort)
			),
			new Address(
				new AddressHost(process.remoteHost),
				new AddressPort(process.remotePort)
			),
			new ProcessStatus(process.status)
		);
	}

	constructor(
		public readonly id: ProcessId,
		public readonly program: ProcessProgram,
		public readonly protocol: Protocol,
		public readonly local: Address,
		public readonly remote: Address,
		public readonly status: ProcessStatus
	) {
		super();
	}

	get icon(): string {
		return 'plug';
	}

	get label(): string {
		return `${this.local.host.value}:${this.local.port}`;
	}

	get description(): string {
		return `${this.program.value} (${this.id.value}) ─ ${this.protocol.value}`;
	}

	get tooltip(): string {
		let content = '';

		content += `Process ID ─ ${this.id.value}\n`;
		content += `Program ─ ${this.program.value}\n`;
		content += `Protocol ─ ${this.protocol.value}\n`;
		content += `Local Address ─ ${this.local.host.value}:${this.local.port.value}\n`;
		content += `Remote Address ─ ${this.remote.host.value}:${this.remote.port.value}\n`;
		content += `Status ─ ${this.status.value}\n`;

		return content;
	}
}
