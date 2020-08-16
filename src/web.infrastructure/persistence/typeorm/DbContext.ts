import * as fs from 'fs';
import * as path from 'path';
import { ConnectionOptions, createConnection, getConnection } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_TYPE, DB_USER, IS_DEVELOPMENT, REDIS_CONFIG_HOST, REDIS_CONFIG_PORT } from '../../../configs/Configuration';
import { DbConnection } from './DbConnection';
import { IDbConnection } from '../../../web.core/domain/common/persistence/IDbConnection';
import { IDbContext } from '../../../web.core/domain/common/persistence/IDbContext';
import { MessageError } from '../../../web.core/domain/common/exceptions/message/MessageError';
import { Service } from 'typedi';
import { SystemError } from '../../../web.core/domain/common/exceptions/SystemError';

// Map singleton instances.
const folder = path.join(__dirname, './repositories');
fs.readdirSync(folder).forEach(file => require(`${folder}/${file}`));

@Service('db.context')
export class DbContext implements IDbContext {
    getConnection(connectionName?: string): IDbConnection {
        let connection: DbConnection | undefined;
        try {
            connection = getConnection(connectionName) as DbConnection;
        }
        catch { }
        if (!connection || !connection.isConnected)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'database connection');
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
        } as ConnectionOptions) as DbConnection;
    }
}
