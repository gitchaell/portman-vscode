import { StringValueObject } from '../../shared/domain/value-object/StringValueObject';
import { AggregateRoot } from '../../shared/domain/AggregateRoot';

export class Address extends AggregateRoot {
	constructor(
		public readonly host: AddressHost,
		public readonly port: AddressPort
	) {
		super();
	}

	toPrimitives() {
		return {
			host: this.host.value,
			port: this.port.value,
		};
	}
}

export class AddressHost extends StringValueObject {}

export class AddressPort extends StringValueObject {}
