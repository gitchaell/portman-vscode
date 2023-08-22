import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { Process } from '../domain/Process';
import { ProcessRepository } from '../domain/ProcessRepository';
import { LinuxProcessTransformer } from './LinuxProcessTransformer';
import { CommandExecutionError } from '../../shared/domain/CommandExecutionError';

const execute = promisify(exec);
const command = {
	getAll: () => `sudo netstat --numeric --listening --program --tcp --udp`,
	kill: (pid: string) => `sudo kill ${pid}`,
};

export class LinuxProcessRepository implements ProcessRepository {
	async getAll(): Promise<Process[]> {
		return execute(command.getAll()).then(({ stdout, stderr }) => {
			if (stderr) {
				throw new CommandExecutionError(
					`The command executed <${command}> has failed. ${stderr}`
				);
			}

			const transformer = new LinuxProcessTransformer();
			const ports = transformer.transform(stdout);

			return ports;
		});
	}

	async kill(process: Process): Promise<void> {
		return execute(command.kill(process.id.value)).then(console.log);
	}
}
