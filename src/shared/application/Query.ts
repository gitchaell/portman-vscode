export interface Query<T> {
	run(): Promise<T>;
}
