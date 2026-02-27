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
	async search(): Promise<Process[]> {
		const asRootUser = vscode.workspace
			.getConfiguration('portman.linux')
			.get<boolean>('asRootUser');

		// Check for netstat first
		const hasNetstat = await SystemChecker.checkCommand('netstat');

		if (hasNetstat) {
			try {
				const { stdout, stderr } = await execute(command.getAllNetstat(asRootUser));

				// Some netstat versions output warnings to stderr but still work.
				// We proceed if stdout has content.
				if (stdout) {
					const transformer = new LinuxProcessTransformer();
					return transformer.transform(stdout);
				}
			} catch (error) {
				// Fallback to ss if netstat fails
				// console.warn('Netstat failed, trying ss...', error);
			}
		}

		// Check for ss
		const hasSS = await SystemChecker.checkCommand('ss');
		if (hasSS) {
			try {
				const { stdout } = await execute(command.getAllSS(asRootUser));
				const transformer = new LinuxSSProcessTransformer();
				return transformer.transform(stdout);
			} catch (error: any) {
				throw new CommandExecutionError(
					`The command 'ss' executed has failed. ${error.message}`
				);
			}
		}

		throw new CommandExecutionError(
			`Neither 'netstat' nor 'ss' commands are available on this system or failed to execute.`
		);
	}

	async kill(process: Process): Promise<void> {
		const asRootUser = vscode.workspace
			.getConfiguration('portman.linux')
			.get<boolean>('asRootUser');

		const { stderr } = await execute(command.kill(process.id.value, asRootUser));
		if (stderr) {
			throw new CommandExecutionError(
				`The command executed has failed. ${stderr}`
			);
		}
	}
}
