import { StringValueObject } from '../../shared/domain/value-object/StringValueObject';
import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { InvalidArgumentError } from '../../shared/domain/value-object/InvalidArgumentError';

export class Process extends AggregateRoot {
	constructor(
		public readonly id: ProcessId,
		public readonly program: ProcessProgram
	) {
		super();
	}

	toPrimitives() {
		return {
			host: this.id.value,
			port: this.program.value,
		};
	}
}

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

export class ProcessProgram extends StringValueObject {}
