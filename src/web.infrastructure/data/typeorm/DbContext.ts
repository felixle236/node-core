import * as path from 'path';
import { Connection, ConnectionOptions, createConnection, getConnection } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_TYPE, DB_USER, ENABLE_QUERY_LOGGING, REDIS_CONFIG_HOST, REDIS_CONFIG_PORT } from '../../../constants/Environments';
import { Service } from 'typedi';
import { SystemError } from '../../../web.core/dtos/common/Exception';

@Service('database.context')
export class DbContext {
    getConnection(): Connection {
        let connection: Connection | undefined;
        try {
            connection = getConnection();
        }
        catch { }
        if (!connection || !connection.isConnected)
            throw new Error('The database connection is not exists!');
        return connection;
    }

    async createConnection(): Promise<Connection> {
        let connection: Connection | undefined;
        try {
            connection = getConnection();
        }
        catch { }
        if (connection && connection.isConnected)
            return connection;

        return await createConnection({
            name: 'default',
            type: DB_TYPE as any,
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
        } as ConnectionOptions);
    }

    async clearCaching(keyCaching: string): Promise<void> {
        if (!keyCaching)
            throw new SystemError(1001, 'key caching');

        const connection = getConnection();
        if (!connection.queryResultCache)
            throw new Error('The database caching is disabled!');

        await connection.queryResultCache.remove([keyCaching]);
    }
}
