import { TreeDataProvider, EventEmitter, TreeItem } from 'vscode';

import { ProcessRepository } from '../domain/ProcessRepository';
import { Process } from '../domain/Process';
import { ProcessTreeItem } from './ProcessTreeItem';
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
		await this.processRepository.kill(port);
	}

	getTreeItem(node: ProcessTreeItem): TreeItem {
		return node;
	}

	async getChildren(): Promise<ProcessTreeItem[]> {
		const processes = await this.processRepository.getAll();
		const nodes = processes.map((process) => new ProcessTreeItem(process));

		return nodes;
	}

	async getQuickItems(): Promise<ProcessQuickPickItem[]> {
		const processes = await this.processRepository.getAll();
		const items = processes.map((process) => new ProcessQuickPickItem(process));

		return items;
	}
}
