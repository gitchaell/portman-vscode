import { Command } from '../../shared/application/Command';
import { Port } from '../domain/Port';
import { PortRepository } from '../domain/PortRepository';

export class KillPort implements Command {
	constructor(private repository: PortRepository) {}

	async run(port: Port): Promise<void> {
		await this.repository.kill(port);
	}
}
