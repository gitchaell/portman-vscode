import { NetworkUtil } from '../domain/NetworkUtil';
import { Port } from '../domain/Port';
import { PortTransformer } from '../domain/PortTransformer';

export class LinuxPortTransformer implements PortTransformer {
	/**
	 * ```
	 const exampleInput = `Active Internet connections (only servers)
		Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
		tcp        0      0 127.0.0.1:16634         0.0.0.0:*               LISTEN      -                   
		tcp        0      0 127.0.0.1:16635         0.0.0.0:*               LISTEN      -                   
		tcp        0      0 127.0.0.1:35659         0.0.0.0:*               LISTEN      -                   
		tcp        0      0 127.0.0.1:53508         0.0.0.0:*               LISTEN      52580/node          
		tcp        0      0 0.0.0.0:2000            0.0.0.0:*               LISTEN      -                   
		tcp        0      0 127.0.0.1:46143         0.0.0.0:*               LISTEN      455/node            
		tcp        0      0 0.0.0.0:2222            0.0.0.0:*               LISTEN      -                   
		tcp        0      0 127.0.0.1:6585          0.0.0.0:*               LISTEN      52657/node          
		tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      -                   
		tcp6       0      0 :::5990                 :::*                    LISTEN      -                   
		tcp6       0      0 :::5991                 :::*                    LISTEN      -                   
		tcp6       0      0 ::1:16634               :::*                    LISTEN      -                   
		tcp6       0      0 ::1:16635               :::*                    LISTEN      -                   
		tcp6       0      0 :::2000                 :::*                    LISTEN      -                   
		tcp6       0      0 :::2222                 :::*                    LISTEN      -                   
		udp        0      0 127.0.0.53:53           0.0.0.0:*                           -                   
		udp        0      0 172.16.5.4:68           0.0.0.0:*                           -                   `
		```
	*/
	transform(input: string): Port[] {
		const lines = input.split('\n');

		const ports: Port[] = [];

		for (const line of lines) {
			const parts = line.trim().split(/\s+/);

			const [
				protocol,
				receivedQueue,
				sendQueue,
				localAddress,
				remoteAddress,
				status,
				process,
			] = parts;

			const [processId, processProgram] = NetworkUtil.parseProcess(process);
			const [localHost, localPort] = NetworkUtil.parseAddress(localAddress);
			const [remoteHost, remotePort] = NetworkUtil.parseAddress(remoteAddress);

			if (
				!processId ||
				!processProgram ||
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

			const port = Port.fromPrimitives({
				processId,
				processProgram,
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
}
