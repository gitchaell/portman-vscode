import * as vscode from 'vscode';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { Process } from '@/domain/Process';
import { ProcessRepository } from '@/domain/ProcessRepository';
import { LinuxProcessTransformer } from './LinuxProcessTransformer';
import { LinuxSSProcessTransformer } from './LinuxSSProcessTransformer';
import { CommandExecutionError } from '@/shared/domain/exceptions/CommandExecutionError';
import { SystemChecker } from '@/shared/infrastructure/SystemChecker';

const execute = promisify(exec);
const command = {
	getAllNetstat: (asRootUser = false) => {
		const cmd = `netstat --numeric --listening --program --tcp --udp | grep LISTEN | awk -v OFS='(|)' '{print $1, $2, $3, $4, $5, $6, $7}'`;
		return `${asRootUser ? 'sudo ' : ''}${cmd}`;
	},
	getAllSS: (asRootUser = false) => {
		// -l: listening, -p: processes, -t: tcp, -u: udp, -n: numeric
		const cmd = `ss -lptn`;
		return `${asRootUser ? 'sudo ' : ''}${cmd}`;
	},
	kill: (pid: string, asRootUser = false) => {
		const cmd = `kill ${pid}`;
		return `${asRootUser ? 'sudo ' : ''}${cmd}`;
	},
};

export class LinuxProcessRepository implements ProcessRepository {
	private async executeSafely(
		commandGenerator: (asRootUser: boolean) => string,
		asRootUser: boolean | undefined,
	): Promise<string> {
		try {
			const { stdout } = await execute(commandGenerator(!!asRootUser));
			return stdout;
		} catch (error: any) {
			if (asRootUser) {
				try {
					const { stdout } = await execute(commandGenerator(false));
					return stdout;
				} catch (retryError) {
					// Fallback failed, propagate the original error which might be more descriptive about permissions
				}
			}
			throw error;
		}
	}

	async search(): Promise<Process[]> {
		const asRootUser = vscode.workspace
			.getConfiguration('portman.linux')
			.get<boolean>('asRootUser');

		// Check for netstat first
		const hasNetstat = await SystemChecker.checkCommand('netstat');

		if (hasNetstat) {
			try {
				const stdout = await this.executeSafely(command.getAllNetstat, asRootUser);

				if (stdout) {
					const transformer = new LinuxProcessTransformer();
					return transformer.transform(stdout);
				}
			} catch (error) {
				// Fallback to ss
			}
		}

		// Check for ss
		const hasSS = await SystemChecker.checkCommand('ss');
		if (hasSS) {
			try {
				const stdout = await this.executeSafely(command.getAllSS, asRootUser);
				const transformer = new LinuxSSProcessTransformer();
				return transformer.transform(stdout);
			} catch (error: any) {
				throw new CommandExecutionError(
					`The command 'ss' failed. Error: ${error.message}. Please check if you have permissions.`,
				);
			}
		}

		throw new CommandExecutionError(
			`Neither 'netstat' nor 'ss' commands are available. Please install 'net-tools' (for netstat) or 'iproute2' (for ss) package.`,
		);
	}

	async kill(process: Process): Promise<void> {
		const asRootUser = vscode.workspace
			.getConfiguration('portman.linux')
			.get<boolean>('asRootUser');

		try {
			await this.executeSafely((asRoot) => command.kill(process.id.value, asRoot), asRootUser);
		} catch (error: any) {
			throw new CommandExecutionError(
				`Failed to kill process ${process.id.value}. Error: ${error.message}.`,
			);
		}
	}
}
