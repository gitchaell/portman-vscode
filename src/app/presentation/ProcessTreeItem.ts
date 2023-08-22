import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';

import { Process } from '../domain/Process';

export class ProcessTreeItem extends TreeItem {
	constructor(public readonly process: Process) {
		super(process.label, TreeItemCollapsibleState.None);

		this.id = this.process.id.value;

		this.iconPath = new ThemeIcon(process.icon);

		this.contextValue = 'process';

		this.command = {
			command: 'portman.showInfo',
			title: '',
			arguments: [this],
		};
	}
}
