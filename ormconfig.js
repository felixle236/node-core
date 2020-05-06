const path = require('path');
const sourceDir = process.env.NODE_ENV === 'development' ? 'src' : 'dist';

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
            host: process.env.REDIS_CONFIG_HOST,
            port: Number(process.env.REDIS_CONFIG_PORT)
        }
    },
    synchronize: false,
    logging: true,
    entities: [
        path.join(__dirname, `./${sourceDir}/web.infrastructure/data/typeorm/entities/*{.js,.ts}`)
    ],
    migrations: [
        path.join(__dirname, `./${sourceDir}/web.infrastructure/data/typeorm/migrations/*{.js,.ts}`)
    ],
    subscribers: [
        path.join(__dirname, `./${sourceDir}/web.infrastructure/data/typeorm/subscribers/*{.js,.ts}`)
    ],
    cli: {
        entitiesDir: `${sourceDir}/web.infrastructure/data/typeorm/entities`,
        migrationsDir: `${sourceDir}/web.infrastructure/data/typeorm/migrations`,
        subscribersDir: `${sourceDir}/web.infrastructure/data/typeorm/subscribers`
    }
};
