import { randomUUID } from 'node:crypto';
import { InvalidArgumentError } from './InvalidArgumentError';
import { ValueObject } from './ValueObject';

export class Uuid extends ValueObject<string> {
	constructor(value: string) {
		super(value);
		this.ensureIsValidUuid(value);
	}

	static random(): Uuid {
		return new Uuid(randomUUID());
	}

	private ensureIsValidUuid(id: string): void {
		const uuidPattern =
			/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

		if (!uuidPattern.test(id)) {
			throw new InvalidArgumentError(
				`<${this.constructor.name}> does not allow the value <${id}>`
			);
		}
	}
}
