import * as vscode from 'vscode';
import {
	PortNode,
	PortProvider,
} from './app/infrastructure/providers/PortProvider';

export function activate(context: vscode.ExtensionContext) {
	const portProvider = new PortProvider();

	vscode.window.registerTreeDataProvider('portman', portProvider);

	const view = vscode.window.createTreeView('portman', {
		treeDataProvider: portProvider,
	});

	vscode.commands.registerCommand('portman.refresh', () =>
		portProvider.refresh()
	);

	vscode.commands.registerCommand('portman.kill', () => {
		// TODO: request port number input

		// if (!node) {
		// 	vscode.window.showErrorMessage('Port not selected');
		// 	return;
		// }

		// vscode.window.showInformationMessage(`Killing port <${node.label}>`);
	});

	context.subscriptions.push(view);
}

export function deactivate() {}
