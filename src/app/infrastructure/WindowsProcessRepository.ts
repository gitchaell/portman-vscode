import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { ProcessRepository } from '../domain/ProcessRepository';
import { Process } from '../domain/Process';

const execute = promisify(exec);

export class WindowsProcessRepository implements ProcessRepository {
	async getAll(): Promise<Process[]> {
		execute('netstat -ano').then((output) => {
			console.log(output);
		});

		return [];
	}

	async kill(_process: Process): Promise<void> {
		throw new Error(`WindowsProcessRepository.kilk() method not implemented.`);
	}
}
