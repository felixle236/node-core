import { Connection } from 'typeorm';
import { IDbConnection } from '../../../web.core/domain/common/database/interfaces/IDbConnection';
import { IDbMigration } from '../../../web.core/domain/common/database/interfaces/IDbMigration';
import { IDbQueryRunner } from '../../../web.core/domain/common/database/interfaces/IDbQueryRunner';
import { TransactionIsolationLevel } from '../../../web.core/domain/common/database/TransactionIsolationLevel';
import { MessageError } from '../../../web.core/domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../web.core/domain/common/exceptions/SystemError';

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
        runInTransaction: (queryRunner: IDbQueryRunner)=> Promise<T>,
        rollback?: (error: Error)=> Promise<void>,
        done?: ()=> Promise<void>,
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
