export interface ILogService {
    writeLog(content: string): Promise<void>;
    writeLog(content: object): Promise<void>;

    writeErrorLog(content: string): Promise<void>;
    writeErrorLog(content: object): Promise<void>;
}
