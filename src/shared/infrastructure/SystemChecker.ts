import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execute = promisify(exec);

export class SystemChecker {
	static async checkCommand(command: string): Promise<boolean> {
		try {
			// On Windows, 'where' checks for executable. On *nix, 'command -v'.
			const checkCmd = process.platform === 'win32'
				? `where ${command}`
				: `command -v ${command}`;

			await execute(checkCmd);
			return true;
		} catch (error) {
			return false;
		}
	}
}
