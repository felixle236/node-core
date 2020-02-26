const path = require('path');

module.exports = {
    name: 'default',
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    cache: {
        type: 'redis',
        options: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT)
        }
    },
    synchronize: false,
    logging: true,
    entities: [
        path.join(__dirname, './src/web.infrastructure/data/typeorm/entities/*{.js,.ts}')
    ],
    migrations: [
        path.join(__dirname, './src/web.infrastructure/data/typeorm/migrations/*{.js,.ts}')
    ],
    subscribers: [
        path.join(__dirname, './src/web.infrastructure/data/typeorm/subscribers/*{.js,.ts}')
    ],
    cli: {
        entitiesDir: 'src/web.infrastructure/data/typeorm/entities',
        migrationsDir: 'src/web.infrastructure/data/typeorm/migrations',
        subscribersDir: 'src/web.infrastructure/data/typeorm/subscribers'
    }
};
