import { AggregateRoot } from "@/shared/domain/AggregateRoot";
import { AddressHost } from "./AddressHost";
import { AddressPort } from "./AddressPort";

export class Address extends AggregateRoot {
	constructor(
		public readonly host: AddressHost,
		public readonly port: AddressPort
	) {
		super();
	}
}
