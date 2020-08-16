import { Connection } from 'typeorm';
import { IDbConnection } from '../../../web.core/domain/common/persistence/IDbConnection';
import { IDbMigration } from '../../../web.core/domain/common/persistence/IDbMigration';
import { IDbQueryRunner } from '../../../web.core/domain/common/persistence/IDbQueryRunner';
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

    async runTransaction<T>(runInTransaction: (queryRunner: IDbQueryRunner)=> Promise<T>, isolationLevel?: TransactionIsolationLevel): Promise<T> {
        return await this._connection.transaction(isolationLevel!, async entityManager => {
            const queryRunner = entityManager.connection.createQueryRunner();
            return await runInTransaction(queryRunner);
        });
    }

    async runMigrations(options?: { transaction?: 'all' | 'none' | 'each' | undefined }): Promise<IDbMigration[]> {
        return await this._connection.runMigrations(options);
    }
}
