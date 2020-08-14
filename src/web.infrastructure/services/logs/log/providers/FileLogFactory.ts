import * as path from 'path';
import { ILogService } from '../../../../../web.core/gateways/services/ILogService';
import { appendFile } from '../../../../../libs/file';

export class FileLogFactory implements ILogService {
    async writeLog(content: string): Promise<void> {
        const date = new Date();
        const folder = path.join(__dirname, '../../../../../logs');
        const file = `${folder}/${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.log`;
        const body = `${(new Date()).toLocaleString()} : ${content}\n`;

        await appendFile(file, body, 'utf8');
    }
};
