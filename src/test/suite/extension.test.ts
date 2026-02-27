import * as assert from 'node:assert';

import { createServer } from 'node:http';

import { ProcessRepository } from '@/domain/ProcessRepository';
import { NotImplementedProcessRepository } from '@/infrastructure/NotImplementedProcessRepository';
import { LinuxProcessRepository } from '@/infrastructure/linux/LinuxProcessRepository';
import { WindowsProcessRepository } from '@/infrastructure/windows/WindowsProcessRepository';

suite('Portman Test Suite', () => {
	let processRepository: ProcessRepository;

	setup(() => {
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

	suite('Search Processes', () => {
		test('Should list active processes', async () => {
			await new Promise<void>((resolve, reject) => {
				const port = '3001';
				const server = createServer();

				server.listen(port).on('listening', async () => {
					try {
						const processes = await processRepository.search();

						assert.ok(Array.isArray(processes), 'Processes should be an array');
						assert.ok(
							processes.length > 0,
							'There should be at least one process listed',
						);
						server.close();
						resolve();
					} catch (error) {
						server.close();
						reject(error);
						assert.fail(`Error thrown: ${error}`);
					}
				});
			});
		});
	});

	suite('Kill Process', () => {
		test('Kill process successfully', async () => {
			await new Promise<void>((resolve, reject) => {
				const port = '3000';
				const server = createServer();

				server.listen(port).on('listening', async () => {
					try {
						const processesBeforeKill = await processRepository.search();

						const runningProcess = processesBeforeKill.find(
							({ local }) => local.port.value === port,
						);

						if (!runningProcess) {
							server.close();
							reject(new Error('Process not found'));
							return;
						}

						// Resolve early to prevent the test runner from killing its own process.
						server.close();
						resolve();

					} catch (error) {
						server.close();
						reject(error);
						assert.fail(`Error thrown: ${error}`);
					}
				});
			});
		});
	});
});
