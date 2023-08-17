import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { Port } from '../domain/Port';
import { PortRepository } from '../domain/PortRepository';
import { LinuxPortTransformer } from './LinuxPortTransformer';
import { CommandExecutionError } from '../../shared/domain/CommandExecutionError';

const execute = promisify(exec);
const command = 'sudo netstat --numeric --listening --program --tcp --udp';

export class LinuxPortRepository implements PortRepository {
	async getAll(): Promise<Port[]> {
		return execute(command).then(({ stdout, stderr }) => {
			if (stderr) {
				console.log(stderr);
				throw new CommandExecutionError(
					`The command executed <${command}> has failed.`
				);
			}

			const portTransformer = new LinuxPortTransformer();
			const ports = portTransformer.transform(stdout);

			return ports;
		});
	}

	async kill(port: Port): Promise<void> {
		throw new Error(`Method not implemented. ${port.label}`);
	}
}
