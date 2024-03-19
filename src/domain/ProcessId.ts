import { InvalidArgumentError } from '@/shared/domain/exceptions/InvalidArgumentError';
import { StringValueObject } from '@/shared/domain/value-object/StringValueObject';

export class ProcessId extends StringValueObject {
	constructor(readonly value: string) {
		super(value);
		this.ensureProcessIdIsValid(value);
	}

	private ensureProcessIdIsValid(value: string) {
		if (isNaN(+value)) {
			throw new InvalidArgumentError(`Process ID <${value}> is not a number`);
		}
	}
}
