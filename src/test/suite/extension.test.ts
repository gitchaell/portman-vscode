import * as assert from 'assert';
import * as vscode from 'vscode';

import { PortRepository } from '../../app/domain/PortRepository';
import { DefaultPortRepository } from '../../app/infrastructure/DefaultPortRepository';
import { LinuxPortRepository } from '../../app/infrastructure/LinuxPortRepository';
import { WindowsPortRepository } from '../../app/infrastructure/WindowsPortRepository';

suite('PortMan Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	let portRepository: PortRepository;

	beforeEach(() => {
		portRepository = {
			aix: new DefaultPortRepository(),
			android: new DefaultPortRepository(),
			cygwin: new DefaultPortRepository(),
			darwin: new DefaultPortRepository(),
			freebsd: new DefaultPortRepository(),
			haiku: new DefaultPortRepository(),
			linux: new LinuxPortRepository(),
			netbsd: new DefaultPortRepository(),
			openbsd: new DefaultPortRepository(),
			sunos: new DefaultPortRepository(),
			win32: new WindowsPortRepository(),
		}[process.platform];
	});

	describe('GetAllPorts Test', () => {
		test('Should list active ports', async () => {
			try {
				await portRepository.getAll();
			} catch (error) {
				assert.fail(`Error thrown: ${error}`);
			}
		});
	});
});
