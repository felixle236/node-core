import * as path from 'path';
import { ConnectionOptions, createConnection, getConnection } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_TYPE, DB_USER, ENABLE_QUERY_LOGGING, REDIS_CONFIG_HOST, REDIS_CONFIG_PORT } from '../../../constants/Environments';
import { DbConnection } from './DbConnection';
import { IDbConnection } from '../../../web.core/domain/common/persistence/IDbConnection';
import { IDbContext } from '../../../web.core/domain/common/persistence/IDbContext';
import { Service } from 'typedi';
import { SystemError } from '../../../web.core/dtos/common/Exception';

@Service('db.context')
export class DbContext implements IDbContext {
    getConnection(connectionName?: string): IDbConnection {
        let connection: DbConnection | undefined;
        try {
            connection = getConnection(connectionName) as DbConnection;
        }
        catch { }
        if (!connection || !connection.isConnected)
            throw new SystemError(1004, 'database connection');
        return connection;
    }

    async createConnection(connectionName?: string): Promise<IDbConnection> {
        let connection: DbConnection | undefined;
        try {
            connection = getConnection(connectionName) as DbConnection;
        }
        catch { }
        if (connection && connection.isConnected)
            return connection;

        return await createConnection({
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
            logging: ENABLE_QUERY_LOGGING,
            entities: [
                path.join(__dirname, './entities/*{.js,.ts}')
            ],
            migrations: [
                path.join(__dirname, './migrations/*{.js,.ts}')
            ],
            subscribers: [
                path.join(__dirname, './subscribers/*{.js,.ts}')
            ]
        } as ConnectionOptions) as DbConnection;
    }
}
