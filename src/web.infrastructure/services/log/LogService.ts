import { ILogService } from '../../../web.core/gateways/services/ILogService';
import { Logger } from './logger/Logger';
import { Service } from 'typedi';

@Service('log.service')
export class LogService implements ILogService {
    private readonly _logger: Logger;

    constructor() {
        this._logger = new Logger();
    }

    async writeLog(content: string | object): Promise<void> {
        const data = typeof content === 'string' ? content : JSON.stringify(content, undefined, 2);
        return await this._logger.writeLog(data);
    }

    async writeErrorLog(content: string | object): Promise<void> {
        const data = typeof content === 'string' ? content : JSON.stringify(content, undefined, 2);
        return await this._logger.writeErrorLog(data);
    }
}
