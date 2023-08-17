import {
	QuickPickItem,
	QuickInputButton,
	QuickPickItemKind,
	ThemeIcon,
	Uri,
} from 'vscode';
import { join } from 'node:path';

import { Port } from '../domain/Port';

export class PortQuickItem implements QuickPickItem {
	readonly label: string;
	readonly kind?: QuickPickItemKind;
	readonly iconPath?: Uri;
	readonly description?: string;
	readonly detail?: string;
	readonly picked?: boolean;
	readonly alwaysShow?: boolean;
	readonly buttons?: readonly QuickInputButton[];

	constructor(public readonly port: Port) {
		this.label = this.port.label;

		this.iconPath = Uri.file(
			join(__filename, '..', '..', 'assets', 'icons', 'port.svg')
		);
	}
}
