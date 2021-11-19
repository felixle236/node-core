import { IDbMigration } from './IDbMigration';
import { DbQuerySession, TransactionIsolationLevel } from '../DbTypes';

export interface IDbConnection {
    clearCaching(keyCaching: string): Promise<void>;

    runTransaction<T>(runInTransaction: (querySession: DbQuerySession) => Promise<T>): Promise<T>;
    runTransaction<T>(runInTransaction: (querySession: DbQuerySession) => Promise<T>, rollback: (error: Error) => Promise<void>): Promise<T>;
    runTransaction<T>(runInTransaction: (querySession: DbQuerySession) => Promise<T>, rollback: (error: Error) => Promise<void>, done: () => Promise<void>): Promise<T>;
    runTransaction<T>(runInTransaction: (querySession: DbQuerySession) => Promise<T>, rollback: (error: Error) => Promise<void>, done: () => Promise<void>, isolationLevel: TransactionIsolationLevel): Promise<T>;

    runMigrations(): Promise<IDbMigration[]>;
    runMigrations(options: { transaction: 'all' | 'none' | 'each' }): Promise<IDbMigration[]>;
}
