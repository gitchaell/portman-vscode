import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { Process } from '../domain/Process';
import { ProcessRepository } from '../domain/ProcessRepository';
import { LinuxProcessTransformer } from './LinuxProcessTransformer';
import { CommandExecutionError } from '../shared/domain/exceptions/CommandExecutionError';
import { stdout } from 'node:process';

const execute = promisify(exec);
const command = {
	isRoot: () => `sudo -h`,
	getAll: (asRoot = false) =>
		`${
			asRoot ? 'sudo ' : ''
		}netstat --numeric --listening --program --tcp --udp | grep LISTEN | awk -v OFS='(|)' '{print $1, $2, $3, $4, $5, $6, $7}'`,
	kill: (pid: string, asRoot = false) => `${asRoot ? 'sudo ' : ''}kill ${pid}`,
};

export class LinuxProcessRepository implements ProcessRepository {
	async search(): Promise<Process[]> {
		const result = execute(command.isRoot()).then(async ({ stdout }) => {
			const asRoot = !!stdout;

			return execute(command.getAll(asRoot)).then(({ stdout, stderr }) => {
				if (stderr) {
					throw new CommandExecutionError(
						`The command executed has failed. ${stderr}`
					);
				}

				const transformer = new LinuxProcessTransformer();
				const ports = transformer.transform(stdout);

				return ports;
			});
		});

		return result;
	}

	async kill(process: Process): Promise<void> {
		execute(command.isRoot()).then(({ stdout }) => {
			const asRoot = !!stdout;
			execute(command.kill(process.id.value, asRoot)).then(({ stderr }) => {
				if (stderr) {
					throw new CommandExecutionError(
						`The command executed has failed. ${stderr}`
					);
				}
			});
		});
	}
}
