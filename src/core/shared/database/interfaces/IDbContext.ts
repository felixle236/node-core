import { IDbConnection } from './IDbConnection';

export interface IDbContext {
    getConnection(): IDbConnection;
    getConnection(connectionName: string): IDbConnection;

    createConnection(): Promise<IDbConnection>;
    createConnection(connectionName: string): Promise<IDbConnection>;

    destroyConnection(): Promise<void>;
    destroyConnection(connectionName: string): Promise<void>;
}
