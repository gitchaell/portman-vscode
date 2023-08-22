import { Process } from '../domain/Process';
import { ProcessTransformer } from '../domain/ProcessTransformer';

export class LinuxProcessTransformer implements ProcessTransformer {
	regExp = {
		port: /:(\d{1,5}|\*)$/,
		process: /(\d+)\/(.+)/,
		separator: /\s+/,
	};

	/**
	 * ```
	 const exampleInput = `Active Internet connections (only servers)
		Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
		tcp        0      0 127.0.0.1:16634         0.0.0.0:*               LISTEN      -                   
		tcp        0      0 127.0.0.1:16635         0.0.0.0:*               LISTEN      -                   
		tcp        0      0 127.0.0.1:35659         0.0.0.0:*               LISTEN      -                   
		tcp        0      0 127.0.0.1:53420         0.0.0.0:*               LISTEN      293542/node         
		tcp        0      0 0.0.0.0:2000            0.0.0.0:*               LISTEN      -                   
		tcp        0      0 127.0.0.1:6011          0.0.0.0:*               LISTEN      294306/node         
		tcp        0      0 127.0.0.1:46143         0.0.0.0:*               LISTEN      455/node            
		tcp        0      0 0.0.0.0:3000            0.0.0.0:*               LISTEN      299913/nc           
		tcp        0      0 127.0.0.1:6388          0.0.0.0:*               LISTEN      293675/node         
		tcp        0      0 0.0.0.0:2222            0.0.0.0:*               LISTEN      22/sshd: /usr/sbin/ 
		tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      -                   
		tcp6       0      0 :::5990                 :::*                    LISTEN      -                   
		tcp6       0      0 :::5991                 :::*                    LISTEN      -                   
		tcp6       0      0 ::1:16634               :::*                    LISTEN      -                   
		tcp6       0      0 ::1:16635               :::*                    LISTEN      -                   
		tcp6       0      0 :::2000                 :::*                    LISTEN      -                   
		tcp6       0      0 :::2222                 :::*                    LISTEN      22/sshd: /usr/sbin/ 
		udp        0      0 127.0.0.53:53           0.0.0.0:*                           -                   
		udp        0      0 172.16.5.4:68           0.0.0.0:*                           -                   `
		```
	*/
	transform(input: string): Process[] {
		const lines = input.split('\n');

		const ports: Process[] = [];

		for (const line of lines) {
			const parts = line.trim().split(this.regExp.separator);

			const [protocol, , , localAddress, remoteAddress, status, process] =
				parts;

			const [id, program] = this.parseProcess(process);
			const [localHost, localPort] = this.parseAddress(localAddress);
			const [remoteHost, remotePort] = this.parseAddress(remoteAddress);

			if (
				!id ||
				!program ||
				!localPort ||
				!localHost ||
				!remotePort ||
				!remoteHost ||
				!status
			) {
				continue;
			}

			if (isNaN(+localPort)) {
				continue;
			}

			const port = Process.fromPrimitives({
				id,
				program,
				protocol,
				localHost,
				localPort,
				remoteHost,
				remotePort,
				status,
			});

			ports.push(port);
		}

		return ports.sort((a, b) => +a.local.port.value - +b.local.port.value);
	}

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
	parseAddress(address: string): [string, string] | [] {
		const result = this.regExp.port.exec(address);

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
	parseProcess(process: string): [string, string] | [] {
		const result = this.regExp.process.exec(process);

		if (!result) {
			return [];
		}

		const [, pid, program] = result;

		return [pid, program];
	}
}
