import * as path from 'path';
import { ConnectionOptions } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_TYPE, DB_USER, IS_DEVELOPMENT, REDIS_CONFIG_HOST, REDIS_CONFIG_PASSWORD, REDIS_CONFIG_PORT, REDIS_CONFIG_PREFIX } from './Configuration';

export default {
    name: 'default',
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
            port: REDIS_CONFIG_PORT,
            password: REDIS_CONFIG_PASSWORD,
            prefix: REDIS_CONFIG_PREFIX
        }
    },
    synchronize: false,
    logging: IS_DEVELOPMENT,
    entities: [
        path.join(__dirname, '../web.infrastructure/databases/typeorm/entities/**/*{.js,.ts}')
    ],
    migrations: [
        path.join(__dirname, '../web.infrastructure/databases/typeorm/migrations/*{.js,.ts}')
    ],
    subscribers: [
        path.join(__dirname, '../web.infrastructure/databases/typeorm/subscribers/*{.js,.ts}')
    ],
    cli: {
        entitiesDir: path.join(__dirname, '../').replace(process.cwd(), '.') + '/web.infrastructure/databases/typeorm/entities',
        migrationsDir: path.join(__dirname, '../').replace(process.cwd(), '.') + '/web.infrastructure/databases/typeorm/migrations',
        subscribersDir: path.join(__dirname, '../').replace(process.cwd(), '.') + '/web.infrastructure/databases/typeorm/subscribers'
    }
} as ConnectionOptions;
