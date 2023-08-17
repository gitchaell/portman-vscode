import * as vscode from 'vscode';
import { PortProvider } from './app/infrastructure/PortProvider';
import { LinuxPortRepository } from './app/infrastructure/LinuxPortRepository';
import { WindowsPortRepository } from './app/infrastructure/WindowsPortRepository';
import { DefaultPortRepository } from './app/infrastructure/DefaultPortRepository';
import { PortRepository } from './app/domain/PortRepository';
import { PortNode } from './app/infrastructure/PortNode';
import { Port } from './app/domain/Port';

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

	const treeView = vscode.window.createTreeView('portman', {
		treeDataProvider: portProvider,
	});

	vscode.commands.registerCommand('portman.refresh', () =>
		portProvider.refresh()
	);

	vscode.commands.registerCommand('portman.showInfo', (node: PortNode) => {
		vscode.window.showInformationMessage(node.port.tooltip);
	});

	vscode.commands.registerCommand('portman.kill', async (node: PortNode) => {
		let port: Port | null = null;

		if (!node) {
			const nodeSelected = await vscode.window.showQuickPick(
				portProvider.getQuickItems(),
				{
					placeHolder: 'Select process/port to kill ...',
					canPickMany: false,
				}
			);

			port = nodeSelected?.port || null;
		} else {
			port = node.port;
		}

		if (!port) {
			vscode.window.showErrorMessage('No process/port selected');
			return;
		}

		const result = await vscode.window.showWarningMessage(
			`Are you sure you want to stop process ${port.label}?`,
			{ modal: true },
			'Kill Process'
		);

		if (result === 'Kill Process') {
			await portProvider.kill(port);

			portProvider.refresh();

			vscode.window.showInformationMessage(
				`The process/port ${port.label} has been stopped`
			);
		}
	});

	context.subscriptions.push(treeView);
}

export function deactivate() {}
