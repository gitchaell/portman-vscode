import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { Port } from '../domain/Port';
import { PortRepository } from '../domain/PortRepository';

const execute = promisify(exec);

export class WindowsPortRepository implements PortRepository {
	async getAll(): Promise<Port[]> {
		execute('netstat -ano').then((output) => {
			console.log(output);
		});

		return [];
	}

	async kill(port: Port): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
