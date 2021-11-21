import dbConfig from 'config/DbConfig';
import { DbQuerySession, TransactionIsolationLevel } from 'shared/database/DbTypes';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { IDbMigration } from 'shared/database/interfaces/IDbMigration';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { SystemError } from 'shared/exceptions/SystemError';
import { Connection, createConnection } from 'typeorm';

export class DbContext implements IDbContext {
    private _connection?: Connection;

    constructor(connection?: Connection) {
        if (connection)
            this._connection = connection;
    }

    getConnection(): Connection {
        if (!this._connection || !this._connection.isConnected)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, { t: 'database_connection' });
        return this._connection;
    }

    async createConnection(): Promise<Connection> {
        if (this._connection && this._connection.isConnected)
            return this._connection;

        this._connection = await createConnection({ ...dbConfig, name: 'default' } as any);
        return this._connection;
    }

    async destroyConnection(): Promise<void> {
        if (this._connection && this._connection.isConnected)
            await this._connection.close();
    }

    async clearCaching(keyCaching: string): Promise<void> {
        if (!keyCaching)
            throw new SystemError(MessageError.PARAM_REQUIRED, { t: 'key_caching' });

        if (!this._connection || !this._connection.isConnected)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, { t: 'database_connection' });

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
        if (!this._connection || !this._connection.isConnected)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, { t: 'database_connection' });

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
        if (!this._connection || !this._connection.isConnected)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, { t: 'database_connection' });

        return await this._connection.runMigrations(options);
    }
}
