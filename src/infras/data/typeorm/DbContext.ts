import dbConfig from 'config/DbConfig';
import { DbQuerySession, DbConnection } from 'shared/database/DbTypes';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { IDbMigration } from 'shared/database/interfaces/IDbMigration';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectDb } from 'shared/types/Injection';
import { Service } from 'typedi';
import { Connection, createConnection as createDbConnection } from 'typeorm';

@Service(InjectDb.DbContext)
export class DbContext implements IDbContext {
  private _connection?: Connection;

  constructor(connection?: DbConnection) {
    if (connection) {
      this._connection = connection;
    }
  }

  getConnection() {
    if (!this._connection || !this._connection.isConnected) {
      throw new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'database_connection' });
    }
    return this._connection;
  }

  async createConnection() {
    if (this._connection && this._connection.isConnected) {
      return this._connection;
    }

    this._connection = await createDbConnection({ ...dbConfig, name: 'default' } as any);
    return this._connection;
  }

  async destroyConnection() {
    if (this._connection && this._connection.isConnected) {
      await this._connection.close();
    }
  }

  async runTransaction<T>(
    runInTransaction: (querySession: DbQuerySession) => Promise<T>,
    rollback?: (error: Error) => Promise<void>,
    done?: () => Promise<void>,
  ): Promise<T> {
    if (!this._connection || !this._connection.isConnected) {
      throw new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'database_connection' });
    }

    const querySession = this._connection.createQueryRunner();
    await querySession.startTransaction();

    return await runInTransaction(querySession)
      .then(async (result) => {
        await querySession.commitTransaction();
        await querySession.release();

        if (done) {
          await done();
        }
        return result;
      })
      .catch(async (error) => {
        await querySession.rollbackTransaction();
        await querySession.release();

        if (rollback) {
          await rollback(error);
        }
        throw error;
      });
  }

  async runMigrations(options?: { transaction?: 'all' | 'none' | 'each' }): Promise<IDbMigration[]> {
    if (!this._connection || !this._connection.isConnected) {
      throw new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'database_connection' });
    }
    return await this._connection.runMigrations(options);
  }
}
