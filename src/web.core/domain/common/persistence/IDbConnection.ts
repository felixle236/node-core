import { IDbMigration } from './IDbMigration';
import { IDbQueryRunner } from './IDbQueryRunner';
import { TransactionIsolationLevel } from './TransactionIsolationLevel';

export interface IDbConnection {
    clearCaching(keyCaching: string): Promise<void>;

    runTransaction<T>(runInTransaction: (queryRunner: IDbQueryRunner)=> Promise<T>): Promise<T>;
    runTransaction<T>(runInTransaction: (queryRunner: IDbQueryRunner)=> Promise<T>, isolationLevel: TransactionIsolationLevel): Promise<T>;

    runMigrations(): Promise<IDbMigration[]>;
    runMigrations(options: { transaction?: 'all' | 'none' | 'each' | undefined }): Promise<IDbMigration[]>;
}
