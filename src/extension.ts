import * as vscode from 'vscode';

import { ProcessRepository } from './app/domain/ProcessRepository';
import { NotImplementedProcessRepository } from './app/infrastructure/NotImplementedProcessRepository';
import { LinuxProcessRepository } from './app/infrastructure/LinuxProcessRepository';
import { WindowsProcessRepository } from './app/infrastructure/WindowsProcessRepository';
import { ProcessTreeDataProvider } from './app/presentation/ProcessTreeDataProvider';
import { ProcessTreeView } from './app/presentation/views/ProcessTreeView';
import { KillProcessCommand } from './app/presentation/commands/KillProcessCommand';
import { RefreshProcessesCommand } from './app/presentation/commands/RefreshProcessesCommand';
import { ShowProcessInfoCommand } from './app/presentation/commands/ShowProcessInfoCommand';

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
