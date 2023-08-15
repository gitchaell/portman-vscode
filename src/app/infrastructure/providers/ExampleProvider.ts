import * as vscode from 'vscode';

export class ExampleProvider implements vscode.TreeDataProvider<ExampleNode> {
	private _onDidChangeTreeData: vscode.EventEmitter<
		ExampleNode | undefined | void
	> = new vscode.EventEmitter<ExampleNode | undefined | void>();

	readonly onDidChangeTreeData: vscode.Event<ExampleNode | undefined | void> =
		this._onDidChangeTreeData.event;

	constructor() {}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: ExampleNode): vscode.TreeItem {
		return element;
	}

	getChildren(element?: ExampleNode): Thenable<ExampleNode[]> {
		return Promise.resolve([
			new ExampleNode('Item #1', vscode.TreeItemCollapsibleState.Expanded),
			new ExampleNode('Item #2', vscode.TreeItemCollapsibleState.Expanded),
			new ExampleNode('Item #3', vscode.TreeItemCollapsibleState.Expanded),
			new ExampleNode('Item #4', vscode.TreeItemCollapsibleState.Expanded),
			new ExampleNode('Item #5', vscode.TreeItemCollapsibleState.Expanded),
			new ExampleNode('Item #6', vscode.TreeItemCollapsibleState.Expanded),
			new ExampleNode('Item #7', vscode.TreeItemCollapsibleState.Expanded),
		]);
	}
}

export class ExampleNode extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}
}
