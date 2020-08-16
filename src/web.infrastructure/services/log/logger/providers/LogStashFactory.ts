import { ILogProvider } from '../interfaces/ILogProvider';

export class LogStashFactory implements ILogProvider {
    async writeLog(_content: string): Promise<void> {
        console.log('Logstash.writeLog is not implemented!');
    }

    async writeErrorLog(_content: string): Promise<void> {
        console.log('Logstash.writeErrorLog is not implemented!');
    }
};
