import { Port } from '../domain/Port';
import { PortRepository } from '../domain/PortRepository';

export class DefaultPortRepository implements PortRepository {
	async getAll(): Promise<Port[]> {
		return [];
	}

	async kill(port: Port): Promise<void> {}
}
