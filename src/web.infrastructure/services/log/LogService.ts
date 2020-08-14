import { ILogService } from '../../../web.core/gateways/services/ILogService';
import { LOG_PROVIDER } from '../../../constants/Environments';
import { LogConsoleFactory } from './providers/LogConsoleFactory';
import { LogFileFactory } from './providers/LogFileFactory';
import { LogProvider } from '../../../constants/Enums';
import { LogStashFactory } from './providers/LogStashFactory';
import { Service } from 'typedi';

@Service('log.service')
export class LogService implements ILogService {
    private readonly _log: ILogService;

    constructor() {
        switch (LOG_PROVIDER) {
        case LogProvider.LOG_FILE:
            this._log = new LogFileFactory();
            break;

        case LogProvider.LOG_STASH:
            this._log = new LogStashFactory();
            break;

        case LogProvider.CONSOLE:
        default:
            this._log = new LogConsoleFactory();
            break;
        }
    }

    async writeLog(content: string): Promise<void> {
        return await this._log.writeLog(content);
    }
}
