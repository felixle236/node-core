import { ILogService } from '../../../../web.core/gateways/services/ILogService';

export class LogConsoleFactory implements ILogService {
    async writeLog(content: string): Promise<void> {
        console.log('LogService.writeLog', content);
    }
}
