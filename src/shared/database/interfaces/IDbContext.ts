import { IDbMigration } from './IDbMigration';
import { DbConnection, DbQuerySession } from '../DbTypes';

export interface IDbContext {
    getConnection(): DbConnection;
    getConnection(connectionName: string): DbConnection;

    createConnection(): Promise<DbConnection>;
    createConnection(connectionName: string): Promise<DbConnection>;

    destroyConnection(): Promise<void>;
    destroyConnection(connectionName: string): Promise<void>;

    clearCaching(keyCaching: string): Promise<void>;

    runTransaction<T>(runInTransaction: (querySession: DbQuerySession) => Promise<T>): Promise<T>;
    runTransaction<T>(runInTransaction: (querySession: DbQuerySession) => Promise<T>, rollback: (error: Error) => Promise<void>): Promise<T>;
    runTransaction<T>(runInTransaction: (querySession: DbQuerySession) => Promise<T>, rollback: (error: Error) => Promise<void>, done: () => Promise<void>): Promise<T>;

    runMigrations(): Promise<IDbMigration[]>;
    runMigrations(options: { transaction: 'all' | 'none' | 'each' }): Promise<IDbMigration[]>;
}
