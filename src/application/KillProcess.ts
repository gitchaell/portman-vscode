import { Process } from '@/domain/Process';
import { ProcessRepository } from '@/domain/ProcessRepository';
import { Command } from '@/shared/application/Command';

export class KillProcess implements Command {
	constructor(private repository: ProcessRepository) {}

	async run(port: Process): Promise<void> {
		await this.repository.kill(port);
	}
}
