import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { Process } from '@/domain/Process';
import { ProcessRepository } from '@/domain/ProcessRepository';
import { CommandExecutionError } from '@/shared/domain/exceptions/CommandExecutionError';
import { MacProcessTransformer } from './MacProcessTransformer';

const execute = promisify(exec);
const command = {
    getAll: () => `lsof -i -P -n | grep LISTEN`,
    kill: (pid: string) => `kill ${pid}`,
};

export class MacProcessRepository implements ProcessRepository {
    async search(): Promise<Process[]> {
        try {
            const { stdout } = await execute(command.getAll());
            const transformer = new MacProcessTransformer();
            return transformer.transform(stdout);
        } catch (error: any) {
             // grep returns exit code 1 if no matches found
             if (error.code === 1) {
                return [];
            }
            throw new CommandExecutionError(
                `The command executed has failed. ${error.message}`
            );
        }
    }

    async kill(process: Process): Promise<void> {
        await execute(command.kill(process.id.value));
    }
}
