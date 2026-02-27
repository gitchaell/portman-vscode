import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { Process } from '@/domain/Process';
import { ProcessRepository } from '@/domain/ProcessRepository';
import { CommandExecutionError } from '@/shared/domain/exceptions/CommandExecutionError';
import { MacProcessTransformer } from './MacProcessTransformer';
import { SystemChecker } from '@/shared/infrastructure/SystemChecker';

const execute = promisify(exec);
const command = {
    getAll: () => `lsof -i -P -n | grep LISTEN`,
    kill: (pid: string) => `kill ${pid}`,
};

export class MacProcessRepository implements ProcessRepository {
    async search(): Promise<Process[]> {
        const hasLsof = await SystemChecker.checkCommand('lsof');
        if (!hasLsof) {
            throw new CommandExecutionError(
                `The command 'lsof' is not available. Please install it to use this extension.`
            );
        }

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
                `Failed to execute 'lsof': ${error.message}. Please check permissions.`
            );
        }
    }

    async kill(process: Process): Promise<void> {
        try {
            await execute(command.kill(process.id.value));
        } catch (error: any) {
            throw new CommandExecutionError(
                `Failed to kill process ${process.id.value}: ${error.message}. You might need root privileges.`
            );
        }
    }
}
