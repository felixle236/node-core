import { ILogProvider } from '../interfaces/ILogProvider';

export class LogConsoleFactory implements ILogProvider {
    async writeLog(content: string): Promise<void> {
        console.log('Log:', content);
    }

    async writeWarningLog(content: string): Promise<void> {
        console.error('Warning log:', content);
    }

    async writeErrorLog(content: string): Promise<void> {
        console.error('Error log:', content);
    }
}
