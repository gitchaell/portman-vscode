import { NetworkAdressUtil } from '../domain/AddressUtil';
import { Port } from '../domain/Port';
import { PortTransformer } from '../domain/PortTransformer';

export class LinuxPortTransformer implements PortTransformer {
	/**
   * 
   * @param input
      Proto Recv-Q Send-Q Local Address           Foreign Address         State      
      tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN     
      tcp        0      0 127.0.0.1:46131         0.0.0.0:*               LISTEN     
      tcp        0      0 0.0.0.0:2000            0.0.0.0:*               LISTEN     
      tcp        0      0 127.0.0.1:32841         0.0.0.0:*               LISTEN     
      tcp        0      0 127.0.0.1:16634         0.0.0.0:*               LISTEN     
      tcp        0      0 127.0.0.1:16635         0.0.0.0:*               LISTEN     
      tcp        0      0 0.0.0.0:2222            0.0.0.0:*               LISTEN     
      tcp6       0      0 :::5991                 :::*                    LISTEN     
      tcp6       0      0 :::5990                 :::*                    LISTEN     
      tcp6       0      0 ::1:16634               :::*                    LISTEN     
      tcp6       0      0 ::1:16635               :::*                    LISTEN     
      tcp6       0      0 :::2000                 :::*                    LISTEN     
      tcp6       0      0 :::2222                 :::*                    LISTEN     
      udp        0      0 127.0.0.53:53           0.0.0.0:*                          
      udp        0      0 172.16.5.4:68           0.0.0.0:*                        
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
			] = parts;

			const [localAddressHost, localAddressPort] =
				NetworkAdressUtil.parse(localAddress);

			const [remoteAddressHost, remoteAddressPort] =
				NetworkAdressUtil.parse(remoteAddress);

			if (
				localAddressPort &&
				localAddressHost &&
				remoteAddressPort &&
				remoteAddressHost &&
				status
			) {
				const port = Port.fromPrimitives({
					protocol,
					localAddressHost,
					localAddressPort,
					remoteAddressHost,
					remoteAddressPort,
					status,
				});

				ports.push(port);
			} else {
				console.log({
					protocol,
					localAddressHost,
					localAddressPort,
					remoteAddressHost,
					remoteAddressPort,
					status,
				});
			}
		}

		return ports;
	}
}
