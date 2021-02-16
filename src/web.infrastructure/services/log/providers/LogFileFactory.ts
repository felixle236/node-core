import * as path from 'path';
import { appendFile } from '../../../../libs/file';
import { ILogProvider } from '../interfaces/ILogProvider';

export class LogFileFactory implements ILogProvider {
    async writeLog(content: string): Promise<void> {
        const date = new Date();
        const folder = path.join(__dirname, '../../../../../logs');
        const file = `${folder}/${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.log`;
        const body = `${(new Date()).toLocaleString()} : ${content}\n`;

        await appendFile(file, body, 'utf8');
    }

    async writeWarningLog(content: string): Promise<void> {
        const date = new Date();
        const folder = path.join(__dirname, '../../../../../logs-warning');
        const file = `${folder}/${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.warning.log`;
        const body = `${(new Date()).toLocaleString()} : ${content}\n`;

        await appendFile(file, body, 'utf8');
    }

    async writeErrorLog(content: string): Promise<void> {
        const date = new Date();
        const folder = path.join(__dirname, '../../../../../logs-error');
        const file = `${folder}/${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.error.log`;
        const body = `${(new Date()).toLocaleString()} : ${content}\n`;

        await appendFile(file, body, 'utf8');
    }
}
