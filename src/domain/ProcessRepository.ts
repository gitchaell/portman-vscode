import { Process } from './Process';

export interface ProcessRepository {
	search(): Promise<Process[]>;
	kill(process: Process): Promise<void>;
}
