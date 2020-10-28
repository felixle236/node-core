import { IDbMigration } from './IDbMigration';
import { IDbQueryRunner } from './IDbQueryRunner';
import { TransactionIsolationLevel } from '../TransactionIsolationLevel';

export interface IDbConnection {
    clearCaching(keyCaching: string): Promise<void>;

    runTransaction<T>(runInTransaction: (queryRunner: IDbQueryRunner)=> Promise<T>): Promise<T | undefined>;
    runTransaction<T>(runInTransaction: (queryRunner: IDbQueryRunner)=> Promise<T>, rollback: (error: Error)=> Promise<void>): Promise<T | undefined>;
    runTransaction<T>(runInTransaction: (queryRunner: IDbQueryRunner)=> Promise<T>, rollback: (error: Error)=> Promise<void>, done: ()=> Promise<void>): Promise<T | undefined>;
    runTransaction<T>(runInTransaction: (queryRunner: IDbQueryRunner)=> Promise<T>, rollback: (error: Error)=> Promise<void>, done: ()=> Promise<void>, isolationLevel: TransactionIsolationLevel): Promise<T | undefined>;

    runMigrations(): Promise<IDbMigration[]>;
    runMigrations(options: { transaction?: 'all' | 'none' | 'each' | undefined }): Promise<IDbMigration[]>;
}
