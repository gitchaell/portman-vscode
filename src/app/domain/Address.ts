import { StringValueObject } from '../../shared/domain/value-object/StringValueObject';
import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { InvalidArgumentError } from '../../shared/domain/value-object/InvalidArgumentError';

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

export class AddressPort extends StringValueObject {
	constructor(readonly value: string) {
		super(value);
		this.ensurePortIsValid(value);
	}

	private ensurePortIsValid(value: string) {
		if (value === '*') {
			return;
		}

		if (isNaN(+value)) {
			throw new InvalidArgumentError(`Port <${value}> is not a number`);
		}

		if (+value < 1 && +value > 65535) {
			throw new InvalidArgumentError(
				`Port <${value}> must be within range [1-65535]`
			);
		}
	}
}
