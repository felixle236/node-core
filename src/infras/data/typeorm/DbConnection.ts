import { DbQuerySession, TransactionIsolationLevel } from 'shared/database/DbTypes';
import { IDbConnection } from 'shared/database/interfaces/IDbConnection';
import { IDbMigration } from 'shared/database/interfaces/IDbMigration';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { SystemError } from 'shared/exceptions/SystemError';
import { Connection } from 'typeorm';

export class DbConnection implements IDbConnection {
    constructor(private _connection: Connection) {}

    async clearCaching(keyCaching: string): Promise<void> {
        if (!keyCaching)
            throw new SystemError(MessageError.PARAM_REQUIRED, { t: 'key_caching' });

        if (!this._connection.queryResultCache)
            throw new SystemError(MessageError.PARAM_NOT_SUPPORTED, { t: 'caching_feature' });

        await this._connection.queryResultCache.remove([keyCaching]);
    }

    async runTransaction<T>(
        runInTransaction: (querySession: DbQuerySession) => Promise<T>,
        rollback?: ((error: Error) => Promise<void>),
        done?: (() => Promise<void>),
        isolationLevel?: TransactionIsolationLevel
    ): Promise<T> {
        const querySession = this._connection.createQueryRunner();
        if (isolationLevel)
            await querySession.startTransaction(isolationLevel);
        else
            await querySession.startTransaction();

        return await runInTransaction(querySession).then(async result => {
            await querySession.commitTransaction();
            await querySession.release();

            if (done)
                await done();
            return result;
        }).catch(async error => {
            await querySession.rollbackTransaction();
            await querySession.release();

            if (rollback)
                await rollback(error);
            throw error;
        });
    }

    async runMigrations(options?: { transaction?: 'all' | 'none' | 'each' }): Promise<IDbMigration[]> {
        return await this._connection.runMigrations(options);
    }
}
