import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { StringValueObject } from '../../shared/domain/value-object/StringValueObject';
import { Uuid } from '../../shared/domain/value-object/Uuid';
import { Address, AddressHost, AddressPort } from './Address';

export class Port extends AggregateRoot {
	constructor(
		public readonly id: PortId,
		public readonly protocol: Protocol,
		public readonly localAddress: Address,
		public readonly remoteAddress: Address,
		public readonly status: PortStatus
	) {
		super();
	}

	get label(): string {
		return `${this.localAddress.port.value} ─ ${this.localAddress.host.value} ─ ${this.protocol.value}`;
	}

	get tooltip(): string {
		return `
Protocol        ${this.protocol.value}
Local Address   ${this.localAddress.host.value}:${this.localAddress.port.value}
Remote Address  ${this.remoteAddress.host.value}:${this.remoteAddress.port.value}
Status          ${this.status.value}`;
	}

	static fromPrimitives(port: {
		protocol: string;
		localAddressHost: string;
		localAddressPort: string;
		remoteAddressHost: string;
		remoteAddressPort: string;
		status: string;
	}): Port {
		return new Port(
			PortId.random(),
			new Protocol(port.protocol),
			new Address(
				new AddressHost(port.localAddressHost),
				new AddressPort(port.localAddressPort)
			),
			new Address(
				new AddressHost(port.remoteAddressHost),
				new AddressPort(port.remoteAddressPort)
			),
			new PortStatus(port.status)
		);
	}

	toPrimitives() {
		return {
			id: this.id.value,
			protocol: this.protocol.value,
			localAddress: {
				host: this.localAddress.host.value,
				port: this.localAddress.port.value,
			},
			remoteAddres: {
				host: this.remoteAddress.host.value,
				port: this.remoteAddress.port.value,
			},
			status: this.status.value,
		};
	}
}

export class PortId extends Uuid {}
export class Protocol extends StringValueObject {}
export class PortStatus extends StringValueObject {}
