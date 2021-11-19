import dbConfig from 'config/DbConfig';
import { IDbConnection } from 'shared/database/interfaces/IDbConnection';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { SystemError } from 'shared/exceptions/SystemError';
import { InjectDb } from 'shared/types/Injection';
import { Service } from 'typedi';
import { Connection, createConnection, getConnection } from 'typeorm';
import { DbConnection } from './DbConnection';

@Service(InjectDb.DbContext)
export class DbContext implements IDbContext {
    getConnection(connectionName = 'default'): IDbConnection {
        let connection: Connection | undefined;
        try {
            connection = getConnection(connectionName);
        }
        catch { }
        if (!connection || !connection.isConnected)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, { t: 'database_connection' });
        return new DbConnection(connection);
    }

    async createConnection(connectionName = 'default'): Promise<IDbConnection> {
        let connection: Connection | undefined;
        try {
            connection = getConnection(connectionName);
        }
        catch { }
        if (connection && connection.isConnected)
            return new DbConnection(connection);

        connection = await createConnection({ ...dbConfig, name: connectionName } as any);
        return new DbConnection(connection);
    }

    async destroyConnection(connectionName = 'default'): Promise<void> {
        let connection: Connection | undefined;
        try {
            connection = getConnection(connectionName);
        }
        catch { }
        if (connection && connection.isConnected)
            await connection.close();
    }
}
