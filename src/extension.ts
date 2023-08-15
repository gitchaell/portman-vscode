import * as vscode from 'vscode';
import { ExampleProvider } from './app/infrastructure/providers/ExampleProvider';

export function activate(context: vscode.ExtensionContext) {
	vscode.window.registerTreeDataProvider('exampleList', new ExampleProvider());

	// vscode.window.createTreeView('exampleList', {
	// 	treeDataProvider: new ExampleProvider(),
	// });
}

export function deactivate() {}
