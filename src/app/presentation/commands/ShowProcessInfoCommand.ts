import * as vscode from 'vscode';
import { Command } from './Command';
import { ProcessTreeItem } from '../ProcessTreeItem';
import { SHOW_INFO_COMMAND } from '../Constants';

export class ShowProcessInfoCommand extends Command {
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
