import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { Port } from '../domain/Port';
import { PortRepository } from '../domain/PortRepository';
import { LinuxPortTransformer } from './LinuxPortTransformer';
import { CommandExecutionError } from '../../shared/domain/CommandExecutionError';

const execute = promisify(exec);
const command = {
	getAll: () => `sudo netstat --numeric --listening --program --tcp --udp`,
	kill: (pid: string) => `sudo kill ${pid}`,
};

export class LinuxPortRepository implements PortRepository {
	async getAll(): Promise<Port[]> {
		return execute(command.getAll()).then(({ stdout, stderr }) => {
			if (stderr) {
				throw new CommandExecutionError(
					`The command executed <${command}> has failed. ${stderr}`
				);
			}

			const portTransformer = new LinuxPortTransformer();
			const ports = portTransformer.transform(stdout);

			return ports;
		});
	}

	async kill(port: Port): Promise<void> {
		return execute(command.kill(port.process.id.value)).then(console.log);
	}
}
