import { IDbQueryRunner } from './IDbQueryRunner';
import { TransactionIsolationLevel } from './TransactionIsolationLevel';

export interface IDbConnection {
    clearCaching(keyCaching: string): Promise<void>;

    runTransaction<T>(runInTransaction: (queryRunner: IDbQueryRunner)=> Promise<T>): Promise<T>;
    runTransaction<T>(runInTransaction: (queryRunner: IDbQueryRunner)=> Promise<T>, isolationLevel: TransactionIsolationLevel): Promise<T>;
}
