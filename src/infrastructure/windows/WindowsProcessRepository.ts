import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { Process } from '@/domain/Process';
import { ProcessRepository } from '@/domain/ProcessRepository';
import { CommandExecutionError } from '@/shared/domain/exceptions/CommandExecutionError';
import { WindowsProcessTransformer } from './WindowsProcessTransformer';
import { WindowsPowerShellProcessTransformer } from './WindowsPowerShellProcessTransformer';
import { SystemChecker } from '@/shared/infrastructure/SystemChecker';

const execute = promisify(exec);
const command = {
	getAllNetstat: () => `netstat -a -b -n -o | findstr LISTENING`,
	getAllPowerShell: () =>
		`powershell -Command "Get-NetTCPConnection -State Listen | Select-Object -Property LocalAddress,LocalPort,OwningProcess"`,
	kill: (pid: string) => `taskkill /PID ${pid}`,
};

export class WindowsProcessRepository implements ProcessRepository {
	async search(): Promise<Process[]> {
		const hasNetstat = await SystemChecker.checkCommand('netstat');
		if (hasNetstat) {
			try {
				const { stdout, stderr } = await execute(command.getAllNetstat());

				if (!stderr && stdout) {
					const transformer = new WindowsProcessTransformer();
					return transformer.transform(stdout);
				}
			} catch (error: any) {
				// Fallback to powershell
			}
		}

		const hasPowerShell = await SystemChecker.checkCommand('powershell');
		if (hasPowerShell) {
			try {
				const { stdout, stderr } = await execute(command.getAllPowerShell());

				if (stderr) {
					throw new CommandExecutionError(
						`The command executed has failed. ${stderr}`,
					);
				}

				if (stdout) {
					const transformer = new WindowsPowerShellProcessTransformer();
					return transformer.transform(stdout);
				}
			} catch (error: any) {
				throw new CommandExecutionError(
					`Failed to search processes via PowerShell: ${error.message}.`,
				);
			}
		}

		throw new CommandExecutionError(
			`Neither 'netstat' nor 'powershell' commands are available. Please verify your Windows installation.`,
		);
	}

	async kill(process: Process): Promise<void> {
		try {
			await execute(command.kill(process.id.value));
		} catch (error: any) {
			throw new CommandExecutionError(
				`Failed to kill process ${process.id.value}: ${error.message}. You might need Admin privileges.`,
			);
		}
	}
}
