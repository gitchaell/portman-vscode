import { randomUUID } from 'node:crypto';
import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';

import { Process } from '@/domain/Process';

export class ProcessTreeItem extends TreeItem {
	constructor(public readonly process: Process) {
		super(process.label, TreeItemCollapsibleState.None);

		this.id = randomUUID();
		this.description = process.description;
		this.tooltip = process.tooltip;

		this.iconPath = new ThemeIcon(process.icon);

		this.contextValue = 'process';

		this.command = {
			command: 'portman.showInfo',
			title: '',
			arguments: [this],
		};
	}
}
