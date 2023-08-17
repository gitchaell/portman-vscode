import {
	TreeDataProvider,
	EventEmitter,
	TreeItem,
	QuickPickItem,
} from 'vscode';
import { PortNode } from './PortNode';
import { PortRepository } from '../domain/PortRepository';
import { PortQuickItem } from './PortQuickItem';
import { Port } from '../domain/Port';

export class PortProvider implements TreeDataProvider<PortNode> {
	private _onDidChangeTreeData = new EventEmitter<
		PortNode | undefined | void
	>();

	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	constructor(private readonly portRepository: PortRepository) {}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	async kill(port: Port): Promise<void> {
		await this.portRepository.kill(port);
	}

	getTreeItem(node: PortNode): TreeItem {
		return node;
	}

	async getChildren(): Promise<PortNode[]> {
		const ports = await this.portRepository.getAll();
		const nodes = ports.map((port) => new PortNode(port));

		return nodes;
	}

	async getQuickItems(): Promise<PortQuickItem[]> {
		const ports = await this.portRepository.getAll();
		const items = ports.map((port) => new PortQuickItem(port));

		return items;
	}
}
