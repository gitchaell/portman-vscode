export interface Command {
	run(...args: any[]): Promise<void>;
}
