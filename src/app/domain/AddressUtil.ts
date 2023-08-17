const IPV4_REGEX_BASE =
	'(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}';
const IPV6_REGEX_BASE =
	'(?:(?:[0-9a-fA-F:]){1,4}(?:(?::(?:[0-9a-fA-F]){1,4}|:)){2,7})+';

const PORT_REGEX = '(?::+(\\d+))?';
const IPV4_REGEX = `(${IPV4_REGEX_BASE})${PORT_REGEX}`;
const IPV6_REGEX = `\\[(${IPV6_REGEX_BASE})\\]${PORT_REGEX}|(${IPV6_REGEX_BASE})`;

export class NetworkAdressUtil {
	static isIP({ exact } = { exact: true }) {
		return exact
			? new RegExp(`(?:^${IPV4_REGEX}$)|(?:^${IPV6_REGEX}$)`)
			: new RegExp(`(?:${IPV4_REGEX})|(?:${IPV6_REGEX})`, 'g');
	}

	static isIPv4({ exact } = { exact: true }) {
		return exact ? new RegExp(`^${IPV4_REGEX}$`) : new RegExp(IPV4_REGEX, 'g');
	}

	static isIPv6({ exact } = { exact: true }) {
		return exact ? new RegExp(`^${IPV6_REGEX}$`) : new RegExp(IPV6_REGEX, 'g');
	}

	static parse(address: string) {
		const parts = new RegExp(`${IPV6_REGEX}|${IPV4_REGEX}`, 'g').exec(address);

		return [
			parts === null ? null : parts[1] || parts[3] || parts[4] || null,
			parts === null ? null : parts[2] || parts[5] || null,
		];
	}
}
