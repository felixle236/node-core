import { IDbConnection } from '@shared/database/interfaces/IDbConnection';
import { IDbMigration } from '@shared/database/interfaces/IDbMigration';
import { IDbQueryRunner } from '@shared/database/interfaces/IDbQueryRunner';
import { TransactionIsolationLevel } from '@shared/database/TransactionIsolationLevel';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { Connection } from 'typeorm';

export class DbConnection implements IDbConnection {
    constructor(private _connection: Connection) {}

    async clearCaching(keyCaching: string): Promise<void> {
        if (!keyCaching)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'key caching');

        if (!this._connection.queryResultCache)
            throw new SystemError(MessageError.PARAM_NOT_SUPPORTED, 'caching feature');

        await this._connection.queryResultCache.remove([keyCaching]);
    }

    async runTransaction<T>(
        runInTransaction: (queryRunner: IDbQueryRunner) => Promise<T>,
        rollback?: (error: Error) => Promise<void>,
        done?: () => Promise<void>,
        isolationLevel?: TransactionIsolationLevel
    ): Promise<T> {
        const queryRunner = this._connection.createQueryRunner();
        await queryRunner.startTransaction(isolationLevel);

        return await runInTransaction(queryRunner).then(async result => {
            await queryRunner.commitTransaction();
            await queryRunner.release();

            if (done)
                await done();
            return result;
        }).catch(async error => {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();

            if (rollback)
                await rollback(error);
            throw error;
        });
    }

    async runMigrations(options?: { transaction?: 'all' | 'none' | 'each' }): Promise<IDbMigration[]> {
        return await this._connection.runMigrations(options);
    }
}
