import { InvalidArgumentError } from '../shared/domain/exceptions/InvalidArgumentError';
import { StringValueObject } from '../shared/domain/value-object/StringValueObject';

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
