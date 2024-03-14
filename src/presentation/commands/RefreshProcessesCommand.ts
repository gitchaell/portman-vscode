import * as vscode from 'vscode';
import { Command } from './Command';
import { REFRESH_COMMAND } from '../Constants';

export class RefreshProcessesCommand extends Command {
	register(): void {
		const command = vscode.commands.registerCommand(REFRESH_COMMAND, () =>
			this.treeDataProvider.refresh()
		);

		this.context.subscriptions.push(command);
	}
}
