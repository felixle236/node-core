import { FileLogFactory } from './providers/FileLogFactory';
import { ILogService } from '../../../web.core/interfaces/gateways/logs/ILogService';
import { Service } from 'typedi';

@Service('log.service')
export class LogService {
    private readonly _logService: ILogService;

    constructor() {
        this._logService = new FileLogFactory();
    }

    writeLog(content: string): Promise<void> {
        return this._logService.writeLog(content);
    }
}
