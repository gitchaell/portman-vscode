import {
	QuickPickItem,
	QuickInputButton,
	QuickPickItemKind,
	ThemeIcon,
} from 'vscode';
import { Process } from '@/domain/Process';

export class ProcessQuickPickItem implements QuickPickItem {
	readonly label: string;
	readonly kind?: QuickPickItemKind;
	readonly iconPath?: ThemeIcon;
	readonly description?: string;
	readonly detail?: string;
	readonly picked?: boolean;
	readonly alwaysShow?: boolean;
	readonly buttons?: readonly QuickInputButton[];

	constructor(public readonly process: Process) {
		this.label = process.label;
		this.description = process.description;

		this.iconPath = new ThemeIcon(process.icon);
	}
}
