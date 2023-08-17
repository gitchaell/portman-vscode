import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { StringValueObject } from '../../shared/domain/value-object/StringValueObject';
import { Uuid } from '../../shared/domain/value-object/Uuid';
import { Address, AddressHost, AddressPort } from './Address';
import { Process, ProcessId, ProcessProgram } from './Process';

export class Port extends AggregateRoot {
	constructor(
		public readonly id: PortId,
		public readonly process: Process,
		public readonly protocol: Protocol,
		public readonly local: Address,
		public readonly remote: Address,
		public readonly status: PortStatus
	) {
		super();
	}

	get label(): string {
		return `${this.process.program.value} (${this.process.id.value}) ─ ${this.local.host.value}:${this.local.port.value}`;
	}

	get tooltip(): string {
		let label = '';

		label += `Process ID ─ ${this.process.id.value}\n`;
		label += `Program ─ ${this.process.program.value}\n`;
		label += `Protocol ─ ${this.protocol.value}\n`;
		label += `Local Address ─ ${this.local.host.value}:${this.local.port.value}\n`;
		label += `Remote Address ─ ${this.remote.host.value}:${this.remote.port.value}\n`;
		label += `Status ─ ${this.status.value}\n`;

		return label;
	}

	static fromPrimitives(port: {
		processId: string;
		processProgram: string;
		protocol: string;
		localHost: string;
		localPort: string;
		remoteHost: string;
		remotePort: string;
		status: string;
	}): Port {
		return new Port(
			PortId.random(),
			new Process(
				new ProcessId(port.processId),
				new ProcessProgram(port.processProgram)
			),
			new Protocol(port.protocol),
			new Address(
				new AddressHost(port.localHost),
				new AddressPort(port.localPort)
			),
			new Address(
				new AddressHost(port.remoteHost),
				new AddressPort(port.remotePort)
			),
			new PortStatus(port.status)
		);
	}

	toPrimitives() {
		return {
			id: this.id.value,
			protocol: this.protocol.value,
			localAddress: {
				host: this.local.host.value,
				port: this.local.port.value,
			},
			remoteAddres: {
				host: this.remote.host.value,
				port: this.remote.port.value,
			},
			status: this.status.value,
		};
	}
}

export class PortId extends Uuid {}
export class Protocol extends StringValueObject {}
export class PortStatus extends StringValueObject {}
