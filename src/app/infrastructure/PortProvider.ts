import { TreeDataProvider, EventEmitter, TreeItem } from 'vscode';
import { PortNode } from './PortNode';
import { PortRepository } from '../domain/PortRepository';

export class PortProvider implements TreeDataProvider<PortNode> {
	private _onDidChangeTreeData = new EventEmitter<
		PortNode | undefined | void
	>();

	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	constructor(private readonly portRepository: PortRepository) {}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(node: PortNode): TreeItem {
		return node;
	}

	async getChildren(): Promise<PortNode[]> {
		const ports = await this.portRepository.getAll();
		const nodes = ports.map(
			(port) => new PortNode(port)
		);

		return nodes;
	}
}
