import { TreeDataProvider, EventEmitter, TreeItem, window } from 'vscode';

import { ProcessTreeItem } from './ProcessTreeItem';
import { ProcessRepository } from '@/domain/ProcessRepository';
import { Process } from '@/domain/Process';
import { ProcessQuickPickItem } from './ProcessQuickPickItem';

export class ProcessTreeDataProvider implements TreeDataProvider<ProcessTreeItem> {
	private _onDidChangeTreeData = new EventEmitter<
		ProcessTreeItem | undefined | void
	>();

	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	constructor(private readonly processRepository: ProcessRepository) {}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	async kill(port: Process): Promise<void> {
		try {
			await this.processRepository.kill(port);
		} catch (error: any) {
			window.showErrorMessage(
				`Failed to kill process: ${error.message}. Please check permissions or try running VS Code as Administrator/root.`,
			);
		}
	}

	getTreeItem(node: ProcessTreeItem): TreeItem {
		return node;
	}

	async getChildren(): Promise<ProcessTreeItem[]> {
		try {
			const processes = await this.processRepository.search();
			const nodes = processes.map((process) => new ProcessTreeItem(process));

			return nodes;
		} catch (error: any) {
			window.showErrorMessage(`Failed to list processes: ${error.message}`);
			return [];
		}
	}

	async getQuickItems(): Promise<ProcessQuickPickItem[]> {
		try {
			const processes = await this.processRepository.search();
			const items = processes.map(
				(process) => new ProcessQuickPickItem(process),
			);

			return items;
		} catch (error: any) {
			window.showErrorMessage(`Failed to list processes: ${error.message}`);
			return [];
		}
	}
}
