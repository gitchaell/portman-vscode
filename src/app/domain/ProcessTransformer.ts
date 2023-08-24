import { Process } from './Process';

export interface ProcessTransformer {
	transform(input: string): Process[];
	sort(processes: Process[]): Process[];
}
