import path from 'path';
import { ConnectionOptions } from 'typeorm';
import { DB_CACHING_HOST, DB_CACHING_PASSWORD, DB_CACHING_PORT, DB_CACHING_PREFIX, DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_TYPE, DB_USER, ENVIRONMENT } from './Configuration';
import { Environment } from './Enums';

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
            host: DB_CACHING_HOST,
            port: DB_CACHING_PORT,
            password: DB_CACHING_PASSWORD,
            prefix: DB_CACHING_PREFIX
        }
    },
    synchronize: false,
    logging: ENVIRONMENT === Environment.Local,
    entities: [
        path.join(__dirname, '../infras/data/typeorm/entities/**/*{.js,.ts}')
    ],
    migrations: [
        path.join(__dirname, '../infras/data/typeorm/migrations/*{.js,.ts}')
    ],
    subscribers: [
        path.join(__dirname, '../infras/data/typeorm/subscribers/*{.js,.ts}')
    ],
    cli: {
        entitiesDir: path.join(__dirname, '../').replace(process.cwd(), '.') + '/infras/data/typeorm/entities',
        migrationsDir: path.join(__dirname, '../').replace(process.cwd(), '.') + '/infras/data/typeorm/migrations',
        subscribersDir: path.join(__dirname, '../').replace(process.cwd(), '.') + '/infras/data/typeorm/subscribers'
    }
} as ConnectionOptions;
