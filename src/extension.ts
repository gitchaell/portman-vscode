import * as vscode from 'vscode';
import { PortProvider } from './app/infrastructure/PortProvider';
import { LinuxPortRepository } from './app/infrastructure/LinuxPortRepository';
import { WindowsPortRepository } from './app/infrastructure/WindowsPortRepository';
import { DefaultPortRepository } from './app/infrastructure/DefaultPortRepository';
import { PortRepository } from './app/domain/PortRepository';

export function activate(context: vscode.ExtensionContext) {
	const portRepository: PortRepository = {
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

	const portProvider = new PortProvider(portRepository);

	vscode.window.registerTreeDataProvider('portman', portProvider);

	const view = vscode.window.createTreeView('portman', {
		treeDataProvider: portProvider,
	});

	vscode.commands.registerCommand('portman.refresh', () =>
		portProvider.refresh()
	);

	vscode.commands.registerCommand('portman.kill', () => {
		// portRepository.kill();
	});

	context.subscriptions.push(view);
}

export function deactivate() {}
