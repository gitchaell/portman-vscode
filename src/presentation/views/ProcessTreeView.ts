import * as vscode from 'vscode';
import { VSView } from './View';

export class ProcessTreeView extends VSView {
	register(): void {
		const treeView = vscode.window.createTreeView('portman', {
			treeDataProvider: this.treeDataProvider,
		});

		this.context.subscriptions.push(treeView);
	}
}
