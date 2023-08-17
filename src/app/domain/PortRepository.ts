import { Port } from './Port';

export interface PortRepository {
	getAll(): Promise<Port[]>;
	kill(port: Port): Promise<void>;
}
