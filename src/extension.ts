import * as vscode from 'vscode';

import { ProcessRepository } from './domain/ProcessRepository';
import { NotImplementedProcessRepository } from './infrastructure/NotImplementedProcessRepository';
import { LinuxProcessRepository } from './infrastructure/linux/LinuxProcessRepository';
import { WindowsProcessRepository } from './infrastructure/windows/WindowsProcessRepository';
import { ProcessTreeDataProvider } from './presentation/ProcessTreeDataProvider';
import { ProcessTreeView } from './presentation/views/ProcessTreeView';
import { KillProcessCommand } from './presentation/commands/KillProcessCommand';
import { RefreshProcessesCommand } from './presentation/commands/RefreshProcessesCommand';
import { ShowProcessInfoCommand } from './presentation/commands/ShowProcessInfoCommand';

export function activate(context: vscode.ExtensionContext) {
	const repository: ProcessRepository = {
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

	const treeDataProvider = new ProcessTreeDataProvider(repository);

	new ProcessTreeView(context, treeDataProvider).register();

	new RefreshProcessesCommand(context, treeDataProvider).register();

	new ShowProcessInfoCommand(context, treeDataProvider).register();

	new KillProcessCommand(context, treeDataProvider).register();
}

export function deactivate() {}
