import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { Process } from '../domain/Process';
import { ProcessRepository } from '../domain/ProcessRepository';
import { LinuxProcessTransformer } from './LinuxProcessTransformer';
import { CommandExecutionError } from '../shared/domain/exceptions/CommandExecutionError';

const execute = promisify(exec);
const command = {
	getAll: () => `sudo netstat --numeric --listening --program --tcp --udp | grep LISTEN | awk -v OFS='(|)' '{print $1, $2, $3, $4, $5, $6, $7}'`,
	kill: (pid: string) => `sudo kill ${pid}`,
};

export class LinuxProcessRepository implements ProcessRepository {
	async search(): Promise<Process[]> {
		return execute(command.getAll()).then(({ stdout, stderr }) => {
			if (stderr) {
				throw new CommandExecutionError(
					`The command executed has failed. ${stderr}`
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
