import * as vscode from 'vscode';
import { VSCommand } from './Command';
import { KILL_COMMAND } from '../Constants';
import { ProcessTreeItem } from '../ProcessTreeItem';
import { Process } from '@/domain/Process';

export class KillProcessCommand extends VSCommand {
	register(): void {
		const command = vscode.commands.registerCommand(
			KILL_COMMAND,
			async (item: ProcessTreeItem) => {
				let process: Process | null = null;

				if (!item) {
					const nodeSelected = await vscode.window.showQuickPick(
						this.treeDataProvider.getQuickItems(),
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
					await this.treeDataProvider.kill(process);

					this.treeDataProvider.refresh();

					vscode.window.showInformationMessage(
						`The process with ID ${process.id} has been stopped`
					);
				}
			}
		);

		this.context.subscriptions.push(command);
	}
}
