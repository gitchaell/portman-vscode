import { ExtensionContext } from 'vscode';
import { ProcessTreeDataProvider } from '../ProcessTreeDataProvider';

export abstract class Command {
	constructor(
		protected readonly context: ExtensionContext,
		protected readonly treeDataProvider: ProcessTreeDataProvider
	) {}

	register(): void {
		throw new Error('Method not implemented.');
	}
}
