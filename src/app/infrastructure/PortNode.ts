import { TreeItem, TreeItemCollapsibleState, Command } from 'vscode';
import { join } from 'node:path';

import { Port } from '../domain/Port';

export class PortNode extends TreeItem {
	constructor(public readonly port: Port) {
		super(port.label, TreeItemCollapsibleState.None);

		this.id = this.port.id.value;
		this.tooltip = this.port.tooltip;

		this.iconPath = join(__filename, '..', '..', 'assets', 'icons', 'port.svg');
		this.contextValue = 'port';
		this.command = {
			command: 'portman.showInfo',
			title: '',
			arguments: [this],
		};
	}

}
