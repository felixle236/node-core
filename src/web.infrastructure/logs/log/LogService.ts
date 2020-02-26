import { FileLogFactory } from './providers/FileLogFactory';
import { ILogService } from '../../../web.core/interfaces/gateways/logs/ILogService';
import { Service } from 'typedi';

@Service('log.service')
export class LogService {
    private logService: ILogService;

    constructor() {
        this.logService = new FileLogFactory();
    }

    writeLog(content: string): Promise<void> {
        return this.logService.writeLog(content);
    }
}
