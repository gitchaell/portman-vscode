import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { Port } from '../domain/Port';
import { PortRepository } from '../domain/PortRepository';
import { LinuxPortTransformer } from './LinuxPortTransformer';

const execute = promisify(exec);

export class LinuxPortRepository implements PortRepository {
	async getAll(): Promise<Port[]> {
		return execute('netstat -tuln').then(({ stdout, stderr }) => {
			if (stderr) {
				console.log(stderr);
				throw new Error('No fue posible obtener la lista de puertos activos');
			}

			const portTransformer = new LinuxPortTransformer();
			const ports = portTransformer.transform(stdout);
			return ports;
		});
	}

	async kill(port: Port): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
