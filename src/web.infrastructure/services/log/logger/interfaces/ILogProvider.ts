export interface ILogProvider {
    writeLog(content: string): Promise<void>;

    writeErrorLog(content: string): Promise<void>;
}
