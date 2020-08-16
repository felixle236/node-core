import { ILogProvider } from '../interfaces/ILogProvider';

export class LogConsoleFactory implements ILogProvider {
    async writeLog(content: string): Promise<void> {
        console.log('LogService.writeLog', content);
    }

    async writeErrorLog(content: string): Promise<void> {
        console.error('LogService.writeLog', content);
    }
}
