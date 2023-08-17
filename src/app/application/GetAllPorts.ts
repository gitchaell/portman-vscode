import { Query } from '../../shared/application/Query';
import { Port } from '../domain/Port';
import { PortRepository } from '../domain/PortRepository';

export class GetAllPorts implements Query<Port[]> {
	constructor(private repository: PortRepository) {}

	async run(): Promise<Port[]> {
		return await this.repository.getAll();
	}
}
