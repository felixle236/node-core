import { ILogProvider } from './interfaces/ILogProvider';
import { LOG_PROVIDER } from '../../../../configs/Configuration';
import { LogConsoleFactory } from './providers/LogConsoleFactory';
import { LogFileFactory } from './providers/LogFileFactory';
import { LogProvider } from '../../../../configs/ServiceProvider';
import { LogStashFactory } from './providers/LogStashFactory';

export class Logger implements ILogProvider {
    private readonly _provider: ILogProvider;

    constructor() {
        switch (LOG_PROVIDER) {
        case LogProvider.LOG_FILE:
            this._provider = new LogFileFactory();
            break;

        case LogProvider.LOG_STASH:
            this._provider = new LogStashFactory();
            break;

        case LogProvider.CONSOLE:
        default:
            this._provider = new LogConsoleFactory();
            break;
        }
    }

    async writeLog(content: string): Promise<void> {
        return await this._provider.writeLog(content);
    }

    async writeErrorLog(content: string): Promise<void> {
        return await this._provider.writeErrorLog(content);
    }
}
