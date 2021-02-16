import { Service } from 'typedi';
import { ILogProvider } from './interfaces/ILogProvider';
import { LogConsoleFactory } from './providers/LogConsoleFactory';
import { LogFileFactory } from './providers/LogFileFactory';
import { LOG_PROVIDER } from '../../../configs/Configuration';
import { LogProvider } from '../../../configs/ServiceProvider';
import { ILogService } from '../../../web.core/gateways/services/ILogService';

@Service('log.service')
export class LogService implements ILogService {
    private readonly _provider: ILogProvider;

    constructor() {
        switch (LOG_PROVIDER) {
        case LogProvider.LOG_FILE:
            this._provider = new LogFileFactory();
            break;

        case LogProvider.CONSOLE:
        default:
            this._provider = new LogConsoleFactory();
            break;
        }
    }

    async writeLog(content: string | object): Promise<void> {
        const data = typeof content === 'string' ? content : JSON.stringify(content, undefined, 2).replace(/\n/g, '');
        return await this._provider.writeLog(data);
    }

    async writeWarningLog(content: string | object): Promise<void> {
        const data = typeof content === 'string' ? content : JSON.stringify(content, undefined, 2).replace(/\n/g, '');
        return await this._provider.writeWarningLog(data);
    }

    async writeErrorLog(content: string | object): Promise<void> {
        const data = typeof content === 'string' ? content : JSON.stringify(content, undefined, 2).replace(/\n/g, '');
        return await this._provider.writeErrorLog(data);
    }
}
