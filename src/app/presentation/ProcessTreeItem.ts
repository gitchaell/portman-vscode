import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';

import { Uuid } from '../../shared/domain/value-object/Uuid';
import { Process } from '../domain/Process';

export class ProcessTreeItem extends TreeItem {
	constructor(public readonly process: Process) {
		super(process.label, TreeItemCollapsibleState.None);

		this.id = Uuid.random().value;
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
