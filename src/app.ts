import './ModuleRegister';
import * as cluster from 'cluster';
import * as os from 'os';
import { API_PORT, ENABLE_API_SERVICE, ENABLE_SOCKET_SERVICE, ENABLE_WEB_SERVICE, IS_DEVELOPMENT, PROJECT_NAME, SOCKET_PORT, WEB_PORT } from './constants/Environments';
import { ApiService } from './web.api/ApiService';
import { Container } from 'typedi';
import { DbContext } from './web.infrastructure/data/typeorm/DbContext';
import { RedisContext } from './web.infrastructure/data/redis/RedisContext';
import { SocketService } from './web.socket/SocketService';
import { WebService } from './web/WebService';

const dbContext = Container.get<DbContext>('database.context');
const redisContext = Container.get<RedisContext>('redis.context');

const startApplication = async () => {
    redisContext.createConnection();
    await dbContext.createConnection();
    if (ENABLE_API_SERVICE)
        ApiService.start();
    if (ENABLE_WEB_SERVICE)
        WebService.start();
    if (ENABLE_SOCKET_SERVICE)
        SocketService.start();
};

const runMigrations = async () => {
    const conn = dbContext.getConnection();
    const migrations = await conn.runMigrations();
    if (!migrations.length)
        console.log('\nNot found new migration.\n');
    migrations.forEach(migration => console.log('\nMigrated: ', '\x1b[32m', migration.name, '\x1b[0m', '\n'));
};

const showServiceStatus = () => {
    if (ENABLE_API_SERVICE)
        console.log('Api service is ready', '\x1b[32m', `http://localhost:${API_PORT}`, '\x1b[0m', !ENABLE_WEB_SERVICE ? '\n' : '');
    if (ENABLE_WEB_SERVICE)
        console.log('Web service is ready', '\x1b[32m', `http://localhost:${WEB_PORT}`, '\x1b[0m', !ENABLE_SOCKET_SERVICE ? '\n' : '');
    if (ENABLE_SOCKET_SERVICE)
        console.log('Socket service is ready', '\x1b[32m', `http://localhost:${SOCKET_PORT}`, '\x1b[0m', '\n');
};

if (IS_DEVELOPMENT) {
    console.log('\n\nStarting project \x1b[1m\x1b[96m' + PROJECT_NAME + '\x1b[0m\x1b[21m with \x1b[32mdevelopment\x1b[0m mode....\n');
    startApplication().then(async () => {
        await runMigrations();
        showServiceStatus();
    }).catch(error => console.log('\x1b[31m', error.message, '\x1b[0m'));
}
else {
    if (cluster.isMaster) {
        console.log('\n\nStarting project \x1b[1m\x1b[96m' + PROJECT_NAME + '\x1b[0m\x1b[21m....\n');
        showServiceStatus();

        const numCPUs = os.cpus().length;
        // Fork workers.
        for (let i = 0; i < numCPUs; i++)
            cluster.fork();

        cluster.on('exit', worker => {
            cluster.fork();
            console.log(`Worker ${worker.process.pid} is died.`);
        });
        console.log(`Master ${process.pid} is started.`);
    }
    else {
        startApplication().then(() => {
            console.log(`Worker ${process.pid} is started.`);
        }).catch(error => {
            console.log('\x1b[31m', error.message, '\x1b[0m');
            setTimeout(() => process.exit(), 2000);
        });
    }
}
