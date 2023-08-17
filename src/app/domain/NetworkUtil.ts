const PORT_REGEX = /:(\d{1,5}|\*)$/;
const PROCESS_REGEX = /(\d+)\/(.+)/;

export class NetworkUtil {
	/**
	 * ```
		const inputs = [
			'127.0.0.1:16634',
			'127.0.0.1:16635',
			'127.0.0.1:35659',
			'127.0.0.1:53508',
			'0.0.0.0:2000',
			'127.0.0.1:46143',
			'0.0.0.0:2222',
			'127.0.0.1:6585',
			'127.0.0.53:53',
			':::5990',
			':::5991',
			'::1:16634',
			'::1:16635',
			':::2000',
			':::2222',
			'127.0.0.53:53',
			'172.16.5.4:68',
			'0.0.0.0:*',
			':::*',
		];
	 * ```
	 */
	static parseAddress(address: string): [string, string] | [] {
		const result = PORT_REGEX.exec(address);

		if (!result) {
			return [];
		}

		const [match, port] = result;

		const host = address.replace(match, '');

		return [host, port];
	}

	/**
	 * ```
		const inputs = [
			'-',
			'52580/node',
			'455/node',
			'52657/node',
			'22/sshd: /usr/sbin/',
		];
	 * ```
	 */
	static parseProcess(process: string): [string, string] | [] {
		const result = PROCESS_REGEX.exec(process);

		if (!result) {
			return [];
		}

		const [, pid, program] = result;

		return [pid, program];
	}
}
