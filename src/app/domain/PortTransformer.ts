import { Port } from './Port';

export interface PortTransformer {
	transform(input: string): Port[];
}
