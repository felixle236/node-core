import path from 'path';
import { Environment } from 'shared/types/Environment';
import { ConnectionOptions } from 'typeorm';
import { DB_CACHE, REDIS_URI, DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_TYPE, DB_USER, ENVIRONMENT } from './Configuration';

export default {
  name: 'default',
  type: DB_TYPE,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASS,
  cache: DB_CACHE && {
    type: 'redis',
    options: {
      url: REDIS_URI,
      legacyMode: true,
    },
  },
  synchronize: false,
  logging: ENVIRONMENT === Environment.Local,
  entities: [path.join(__dirname, '../infras/data/typeorm/entities/**/*{.js,.ts}')],
  migrations: [path.join(__dirname, '../infras/data/typeorm/migrations/*{.js,.ts}')],
  subscribers: [path.join(__dirname, '../infras/data/typeorm/subscribers/*{.js,.ts}')],
  cli: {
    entitiesDir: path.join(__dirname, '../').replace(process.cwd(), '.') + '/infras/data/typeorm/entities',
    migrationsDir: path.join(__dirname, '../').replace(process.cwd(), '.') + '/infras/data/typeorm/migrations',
    subscribersDir: path.join(__dirname, '../').replace(process.cwd(), '.') + '/infras/data/typeorm/subscribers',
  },
} as ConnectionOptions;
