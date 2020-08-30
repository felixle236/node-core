import * as path from 'path';
import { Connection, ConnectionOptions, createConnection, getConnection } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_TYPE, DB_USER, IS_DEVELOPMENT, REDIS_CONFIG_HOST, REDIS_CONFIG_PORT } from '../../../configs/Configuration';
import { DbConnection } from './DbConnection';
import { IDbConnection } from '../../../web.core/domain/common/database/interfaces/IDbConnection';
import { IDbContext } from '../../../web.core/domain/common/database/interfaces/IDbContext';
import { MessageError } from '../../../web.core/domain/common/exceptions/message/MessageError';
import { Service } from 'typedi';
import { SystemError } from '../../../web.core/domain/common/exceptions/SystemError';

@Service('db.context')
export class DbContext implements IDbContext {
    getConnection(connectionName?: string): IDbConnection {
        let connection: Connection | undefined;
        try {
            connection = getConnection(connectionName);
        }
        catch { }
        if (!connection || !connection.isConnected)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'database connection');
        return new DbConnection(connection);
    }

    async createConnection(connectionName?: string): Promise<IDbConnection> {
        let connection: Connection | undefined;
        try {
            connection = getConnection(connectionName);
        }
        catch { }
        if (connection && connection.isConnected)
            return new DbConnection(connection);

        connection = await createConnection({
            name: connectionName,
            type: DB_TYPE,
            host: DB_HOST,
            port: DB_PORT,
            database: DB_NAME,
            username: DB_USER,
            password: DB_PASS,
            cache: {
                type: 'redis',
                options: {
                    host: REDIS_CONFIG_HOST,
                    port: REDIS_CONFIG_PORT
                }
            },
            synchronize: false,
            logging: IS_DEVELOPMENT,
            entities: [
                path.join(__dirname, './entities/*{.js,.ts}')
            ],
            migrations: [
                path.join(__dirname, './migrations/*{.js,.ts}')
            ],
            subscribers: [
                path.join(__dirname, './subscribers/*{.js,.ts}')
            ]
        } as ConnectionOptions);
        return new DbConnection(connection);
    }
}
