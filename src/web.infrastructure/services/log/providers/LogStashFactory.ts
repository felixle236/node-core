import { ILogService } from '../../../../web.core/gateways/services/ILogService';

export class LogStashFactory implements ILogService {
    async writeLog(_content: string): Promise<void> {
        console.log('Logstash.writeLog is not implemented!');
    }
};
