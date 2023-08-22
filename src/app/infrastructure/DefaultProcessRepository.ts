import { Process } from '../domain/Process';
import { ProcessRepository } from '../domain/ProcessRepository';

export class DefaultProcessRepository implements ProcessRepository {
	async getAll(): Promise<Process[]> {
		return [];
	}

	async kill(_process: Process): Promise<void> {
		throw new Error(`DefaultProcessRepository.kill() method not implemented.`);
	}
}
