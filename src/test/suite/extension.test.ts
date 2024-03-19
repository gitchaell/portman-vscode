import * as assert from 'node:assert';

import { createServer } from 'node:http';

import { ProcessRepository } from '@/domain/ProcessRepository';
import { NotImplementedProcessRepository } from '@/infrastructure/NotImplementedProcessRepository';
import { LinuxProcessRepository } from '@/infrastructure/linux/LinuxProcessRepository';
import { WindowsProcessRepository } from '@/infrastructure/windows/WindowsProcessRepository';

suite('Portman Test Suite', () => {
	let processRepository: ProcessRepository;

	beforeEach(() => {
		processRepository = {
			aix: new NotImplementedProcessRepository(),
			android: new LinuxProcessRepository(),
			cygwin: new LinuxProcessRepository(),
			darwin: new LinuxProcessRepository(),
			freebsd: new LinuxProcessRepository(),
			haiku: new LinuxProcessRepository(),
			linux: new LinuxProcessRepository(),
			netbsd: new LinuxProcessRepository(),
			openbsd: new LinuxProcessRepository(),
			sunos: new LinuxProcessRepository(),
			win32: new WindowsProcessRepository(),
		}[process.platform];
	});

	describe('Search Processes', () => {
		test('Should list active processes', async () => {
			try {
				const processes = await processRepository.search();

				assert.ok(Array.isArray(processes), 'Processes should be an array');
				assert.ok(
					processes.length > 0,
					'There should be at least one process listed'
				);
			} catch (error) {
				assert.fail(`Error thrown: ${error}`);
			}
		});
	});

	describe('Kill Process', () => {
		test('Kill process successfully', async () => {
			await new Promise<void>(async (resolve, reject) => {
				const port = '3000';
				const server = createServer();

				server.listen(port).on('connection', async () => {
					try {
						const processesBeforeKill = await processRepository.search();

						const runningProcess = processesBeforeKill.find(
							({ local }) => local.port.value === port
						);

						if (!runningProcess) {
							throw new Error('Process not found');
						}

						await processRepository.kill(runningProcess);

						const processesAfterKill = await processRepository.search();

						const killedProcess = processesAfterKill.some(
							({ local }) => local.port.value === port
						);

						assert.strictEqual(
							killedProcess,
							false,
							'Process should be killed'
						);

						server.close();
						resolve();
					} catch (error) {
						server.close();
						reject();
						assert.fail(`Error thrown: ${error}`);
					}
				});
			});
		});
	});
});
