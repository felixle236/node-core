import { Connection } from 'typeorm';
import { IDbConnection } from '../../../web.core/domain/common/persistence/interfaces/IDbConnection';
import { IDbMigration } from '../../../web.core/domain/common/persistence/interfaces/IDbMigration';
import { IDbQueryRunner } from '../../../web.core/domain/common/persistence/interfaces/IDbQueryRunner';
import { MessageError } from '../../../web.core/domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../web.core/domain/common/exceptions/SystemError';
import { TransactionIsolationLevel } from '../../../web.core/domain/common/persistence/TransactionIsolationLevel';

export class DbConnection implements IDbConnection {
    constructor(private _connection: Connection) {}

    async clearCaching(keyCaching: string): Promise<void> {
        if (!keyCaching)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'key caching');

        if (!this._connection.queryResultCache)
            throw new SystemError(MessageError.NOT_SUPPORTED, 'caching feature');

        await this._connection.queryResultCache.remove([keyCaching]);
    }

    async runTransaction(runInTransaction: (queryRunner: IDbQueryRunner)=> Promise<void>, rollback: (error: Error)=> Promise<void>, isolationLevel?: TransactionIsolationLevel): Promise<void> {
        let err;
        const query = this._connection.createQueryRunner();
        await query.startTransaction(isolationLevel);

        try {
            await runInTransaction(query);
            await query.commitTransaction();
        }
        catch (error) {
            err = error;
            await query.rollbackTransaction();
        }
        finally {
            await query.release();
        }

        if (err && rollback)
            await rollback(err);
    }

    async runMigrations(options?: { transaction?: 'all' | 'none' | 'each' | undefined }): Promise<IDbMigration[]> {
        return await this._connection.runMigrations(options);
    }
}
