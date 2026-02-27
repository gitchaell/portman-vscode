import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { Process } from '@/domain/Process';
import { ProcessRepository } from '@/domain/ProcessRepository';
import { CommandExecutionError } from '@/shared/domain/exceptions/CommandExecutionError';
import { MacProcessTransformer } from './MacProcessTransformer';
import { MacNetstatProcessTransformer } from './MacNetstatProcessTransformer';
import { SystemChecker } from '@/shared/infrastructure/SystemChecker';

const execute = promisify(exec);
const command = {
	getAllLsof: () => `lsof -i -P -n | grep LISTEN`,
	getAllNetstat: () => `netstat -anv -p tcp | grep LISTEN`,
	kill: (pid: string) => `kill ${pid}`,
};

export class MacProcessRepository implements ProcessRepository {
	async search(): Promise<Process[]> {
		const hasLsof = await SystemChecker.checkCommand('lsof');
		if (hasLsof) {
			try {
				const { stdout } = await execute(command.getAllLsof());
				const transformer = new MacProcessTransformer();
				return transformer.transform(stdout);
			} catch (error: any) {
				// grep returns exit code 1 if no matches found
				if (error.code === 1) {
					return [];
				}
				// If lsof fails due to permissions, fallback to netstat
			}
		}

		const hasNetstat = await SystemChecker.checkCommand('netstat');
		if (hasNetstat) {
			try {
				const { stdout } = await execute(command.getAllNetstat());
				const transformer = new MacNetstatProcessTransformer();
				return transformer.transform(stdout);
			} catch (error: any) {
				if (error.code === 1) {
					return [];
				}
				throw new CommandExecutionError(
					`Failed to execute 'netstat': ${error.message}.`,
				);
			}
		}

		throw new CommandExecutionError(
			`Neither 'lsof' nor 'netstat' commands are available. Please install them to use this extension.`,
		);
	}

	async kill(process: Process): Promise<void> {
		try {
			await execute(command.kill(process.id.value));
		} catch (error: any) {
			throw new CommandExecutionError(
				`Failed to kill process ${process.id.value}: ${error.message}. You might need root privileges.`,
			);
		}
	}
}
