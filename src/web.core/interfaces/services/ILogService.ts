export interface ILogService {
    writeLog(content: string): Promise<void>;
}
