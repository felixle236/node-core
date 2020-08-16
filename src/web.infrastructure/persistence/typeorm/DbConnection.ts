import { Connection } from 'typeorm';
import { IDbConnection } from '../../../web.core/domain/common/persistence/IDbConnection';
import { IDbQueryRunner } from '../../../web.core/domain/common/persistence/IDbQueryRunner';
import { MessageError } from '../../../web.core/domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../web.core/domain/common/exceptions/SystemError';
import { TransactionIsolationLevel } from '../../../web.core/domain/common/persistence/TransactionIsolationLevel';

export class DbConnection extends Connection implements IDbConnection {
    async clearCaching(keyCaching: string): Promise<void> {
        if (!keyCaching)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'key caching');

        if (!this.queryResultCache)
            throw new SystemError(MessageError.NOT_SUPPORTED, 'caching feature');

        await this.queryResultCache.remove([keyCaching]);
    }

    async runTransaction<T>(runInTransaction: (queryRunner: IDbQueryRunner)=> Promise<T>, isolationLevel: TransactionIsolationLevel = TransactionIsolationLevel.READ_COMMITTED): Promise<T> {
        return await this.transaction(isolationLevel, async entityManager => {
            const queryRunner = entityManager.connection.createQueryRunner();
            return await runInTransaction(queryRunner);
        });
    }
}
