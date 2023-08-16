import * as vscode from 'vscode';
import * as path from 'path';

export class PortProvider implements vscode.TreeDataProvider<PortNode> {
	private _onDidChangeTreeData: vscode.EventEmitter<
		PortNode | undefined | void
	> = new vscode.EventEmitter<PortNode | undefined | void>();

	readonly onDidChangeTreeData: vscode.Event<PortNode | undefined | void> =
		this._onDidChangeTreeData.event;

	constructor() {}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(node: PortNode): vscode.TreeItem {
		return node;
	}

	getChildren(node?: PortNode): Thenable<PortNode[]> {
		const ports = [
			new PortNode('Item #1'),
			new PortNode('Item #2'),
			new PortNode('Item #3'),
			new PortNode('Item #4'),
			new PortNode('Item #5'),
			new PortNode('Item #6'),
			new PortNode('Item #7'),
		];

		return Promise.resolve(ports);
	}
}

export class PortNode extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
			.TreeItemCollapsibleState.None,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	iconPath = path.join(__filename, '..', '..', 'assets', 'icons', 'port.svg');

	contextValue = 'port';
}
