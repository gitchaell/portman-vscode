import * as assert from 'assert';
import * as vscode from 'vscode';

import { DefaultProcessRepository } from '../../app/infrastructure/DefaultProcessRepository';
import { ProcessRepository } from '../../app/domain/ProcessRepository';
import { LinuxProcessRepository } from '../../app/infrastructure/LinuxProcessRepository';
import { WindowsProcessRepository } from '../../app/infrastructure/WindowsProcessRepository';

suite('PortMan Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	let portRepository: ProcessRepository;

	beforeEach(() => {
		portRepository = {
			aix: new DefaultProcessRepository(),
			android: new DefaultProcessRepository(),
			cygwin: new DefaultProcessRepository(),
			darwin: new DefaultProcessRepository(),
			freebsd: new DefaultProcessRepository(),
			haiku: new DefaultProcessRepository(),
			linux: new LinuxProcessRepository(),
			netbsd: new DefaultProcessRepository(),
			openbsd: new DefaultProcessRepository(),
			sunos: new DefaultProcessRepository(),
			win32: new WindowsProcessRepository(),
		}[process.platform];
	});

	describe('GetAllProcesses Test', () => {
		test('Should list active ports', async () => {
			try {
				await portRepository.getAll();
			} catch (error) {
				assert.fail(`Error thrown: ${error}`);
			}
		});
	});
});
