import * as vscode from 'vscode';
import { VSCommand } from './Command';
import { REFRESH_COMMAND } from '../Constants';

export class RefreshProcessesCommand extends VSCommand {
	register(): void {
		const command = vscode.commands.registerCommand(REFRESH_COMMAND, () =>
			this.treeDataProvider.refresh()
		);

		this.context.subscriptions.push(command);
	}
}
