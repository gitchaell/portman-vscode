import * as vscode from 'vscode';
import { View } from './View';

export class ProcessTreeView extends View {
	register(): void {
		const treeView = vscode.window.createTreeView('portman', {
			treeDataProvider: this.treeDataProvider,
		});

		this.context.subscriptions.push(treeView);
	}
}
