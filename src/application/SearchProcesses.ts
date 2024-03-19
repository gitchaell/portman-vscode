import { Process } from '@/domain/Process';
import { ProcessRepository } from '@/domain/ProcessRepository';
import { Query } from '@/shared/application/Query';

export class SearchProcesses implements Query<Process[]> {
	constructor(private repository: ProcessRepository) {}

	async run(): Promise<Process[]> {
		return await this.repository.search();
	}
}
