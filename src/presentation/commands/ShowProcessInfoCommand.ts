import * as vscode from 'vscode';
import { VSCommand } from './Command';
import { SHOW_INFO_COMMAND } from '../Constants';
import { ProcessTreeItem } from '../ProcessTreeItem';

export class ShowProcessInfoCommand extends VSCommand {
	register(): void {
		const command = vscode.commands.registerCommand(
			SHOW_INFO_COMMAND,
			(item: ProcessTreeItem) => {
				vscode.window.showInformationMessage(item.process.tooltip);
			}
		);

		this.context.subscriptions.push(command);
	}
}
