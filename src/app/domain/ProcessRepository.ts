import { Process } from './Process';

export interface ProcessRepository {
	getAll(): Promise<Process[]>;
	kill(process: Process): Promise<void>;
}
