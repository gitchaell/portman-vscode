import { Process } from './Process';

export interface ProcessTransformer {
	transform(input: string): Process[];
}
