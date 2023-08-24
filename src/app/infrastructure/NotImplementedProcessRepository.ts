import { Process } from '../domain/Process';
import { ProcessRepository } from '../domain/ProcessRepository';

export class NotImplementedProcessRepository implements ProcessRepository {
	async search(): Promise<Process[]> {
		throw new Error(
			`ProcessRepository.search() method not implemented.`
		);
	}

	async kill(_process: Process): Promise<void> {
		throw new Error(`ProcessRepository.kill() method not implemented.`);
	}
}
