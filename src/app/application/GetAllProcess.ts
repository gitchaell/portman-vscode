import { Query } from '../../shared/application/Query';
import { Process } from '../domain/Process';
import { ProcessRepository } from '../domain/ProcessRepository';

export class GetAllProcess implements Query<Process[]> {
	constructor(private repository: ProcessRepository) {}

	async run(): Promise<Process[]> {
		return await this.repository.getAll();
	}
}
