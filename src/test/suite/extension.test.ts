import * as assert from 'assert';
import * as vscode from 'vscode';

import { ProcessRepository } from '../../app/domain/ProcessRepository';
import { NotImplementedProcessRepository } from '../../app/infrastructure/NotImplementedProcessRepository';
import { LinuxProcessRepository } from '../../app/infrastructure/LinuxProcessRepository';
import { WindowsProcessRepository } from '../../app/infrastructure/WindowsProcessRepository';

suite('PortMan Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	let portRepository: ProcessRepository;

	beforeEach(() => {
		portRepository = {
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

	describe('SearchProcesses Test', () => {
		test('Should list active processes', async () => {
			try {
				await portRepository.search();
			} catch (error) {
				assert.fail(`Error thrown: ${error}`);
			}
		});
	});
});
