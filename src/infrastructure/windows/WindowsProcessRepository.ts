import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { Process } from '@/domain/Process';
import { ProcessRepository } from '@/domain/ProcessRepository';
import { CommandExecutionError } from '@/shared/domain/exceptions/CommandExecutionError';
import { WindowsProcessTransformer } from './WindowsProcessTransformer';

const execute = promisify(exec);
const command = {
	getAll: () => `netstat -a -b -n -o | findstr LISTENING`,
	kill: (pid: string) => `taskkill /PID ${pid}`,
};

export class WindowsProcessRepository implements ProcessRepository {
	async search(): Promise<Process[]> {
		const { stdout, stderr } = await execute(command.getAll());

		if (stderr) {
			throw new CommandExecutionError(
				`The command executed has failed. ${stderr}`
			);
		}

		const transformer = new WindowsProcessTransformer();
		const ports = transformer.transform(stdout);

		return ports;
	}

	async kill(process: Process): Promise<void> {
		return execute(command.kill(process.id.value)).then(console.log);
	}
}
