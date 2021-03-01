import { Service } from 'typedi';
import { Connection, createConnection, getConnection } from 'typeorm';
import { DbConnection } from './DbConnection';
import config from '../../../configs/DbConfig';
import { IDbConnection } from '../../../web.core/domain/common/database/interfaces/IDbConnection';
import { IDbContext } from '../../../web.core/domain/common/database/interfaces/IDbContext';
import { MessageError } from '../../../web.core/domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../web.core/domain/common/exceptions/SystemError';

@Service('db.context')
export class DbContext implements IDbContext {
    getConnection(connectionName?: string): IDbConnection {
        let connection: Connection | null = null;
        try {
            connection = getConnection(connectionName);
        }
        catch { }
        if (!connection || !connection.isConnected)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'database connection');
        return new DbConnection(connection);
    }

    async createConnection(connectionName?: string): Promise<IDbConnection> {
        let connection: Connection | null = null;
        try {
            connection = getConnection(connectionName);
        }
        catch { }
        if (connection && connection.isConnected)
            return new DbConnection(connection);

        connection = await createConnection({ ...config, name: connectionName });
        return new DbConnection(connection);
    }

    async destroyConnection(connectionName?: string): Promise<void> {
        let connection: Connection | null = null;
        try {
            connection = getConnection(connectionName);
        }
        catch { }
        if (connection && connection.isConnected)
            await connection.close();
    }
}
