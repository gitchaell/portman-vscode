import * as vscode from 'vscode';

import { ProcessRepository } from './app/domain/ProcessRepository';
import { DefaultProcessRepository } from './app/infrastructure/DefaultProcessRepository';
import { LinuxProcessRepository } from './app/infrastructure/LinuxProcessRepository';
import { WindowsProcessRepository } from './app/infrastructure/WindowsProcessRepository';
import { ProcessTreeDataProvider } from './app/presentation/ProcessTreeDataProvider';
import { ProcessTreeItem } from './app/presentation/ProcessTreeItem';
import { Process } from './app/domain/Process';

export function activate(context: vscode.ExtensionContext) {
	const processRepository: ProcessRepository = {
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

	const processTreeDataProvider = new ProcessTreeDataProvider(
		processRepository
	);

	vscode.window.registerTreeDataProvider('portman', processTreeDataProvider);

	const treeView = vscode.window.createTreeView('portman', {
		treeDataProvider: processTreeDataProvider,
	});

	vscode.commands.registerCommand('portman.refresh', () =>
		processTreeDataProvider.refresh()
	);

	vscode.commands.registerCommand(
		'portman.showInfo',
		(item: ProcessTreeItem) => {
			vscode.window.showInformationMessage(item.process.tooltip);
		}
	);

	vscode.commands.registerCommand(
		'portman.kill',
		async (item: ProcessTreeItem) => {
			let process: Process | null = null;

			if (!item) {
				const nodeSelected = await vscode.window.showQuickPick(
					processTreeDataProvider.getQuickItems(),
					{
						placeHolder: 'Select process to kill ...',
						canPickMany: false,
					}
				);

				process = nodeSelected?.process || null;
			} else {
				process = item.process;
			}

			if (!process) {
				vscode.window.showErrorMessage('No process selected');
				return;
			}

			const result = await vscode.window.showWarningMessage(
				`Are you sure you want to stop process with ID ${process.id}?`,
				{ modal: true },
				'Kill Process'
			);

			if (result === 'Kill Process') {
				await processTreeDataProvider.kill(process);

				processTreeDataProvider.refresh();

				vscode.window.showInformationMessage(
					`The process with ID ${process.id} has been stopped`
				);
			}
		}
	);

	context.subscriptions.push(treeView);
}

export function deactivate() {}
