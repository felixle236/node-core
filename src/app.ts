import './web.infrastructure/SingletonRegister';
import * as cluster from 'cluster';
import * as os from 'os';
import { Container } from 'typedi';
import { API_PORT, ENABLE_API_SERVICE, ENABLE_SOCKET_SERVICE, ENABLE_WEB_SERVICE, IS_DEVELOPMENT, PROJECT_NAME, SOCKET_PORT, WEB_PORT } from './configs/Configuration';
import { ApiService } from './web.api/ApiService';
import { ILogService } from './web.core/gateways/services/ILogService';
import { RedisContext } from './web.infrastructure/databases/redis/RedisContext';
import { DbContext } from './web.infrastructure/databases/typeorm/DbContext';
import { SocketService } from './web.socket/SocketService';
import { WebService } from './web.ui/WebService';

const logService = Container.get<ILogService>('log.service');
const dbContext = Container.get<DbContext>('db.context');
const redisContext = Container.get<RedisContext>('redis.context');

const startApplication = async () => {
    redisContext.createConnection();
    await dbContext.createConnection();
    if (ENABLE_API_SERVICE)
        new ApiService().setup();
    if (ENABLE_WEB_SERVICE)
        new WebService().setup();
    if (ENABLE_SOCKET_SERVICE)
        new SocketService().setup();
};

const runMigrations = async () => {
    logService.info('Run migrations...');
    const conn = dbContext.getConnection();
    const migrations = await conn.runMigrations();
    if (!migrations.length)
        logService.info('Not found new migration.');
    migrations.forEach(migration => logService.info('Migrated: \x1b[32m' + migration.name + '\x1b[0m\n'));
};

const showServiceStatus = () => {
    if (ENABLE_API_SERVICE)
        logService.info(`Api service is ready \x1b[32m http://localhost:${API_PORT} \x1b[0m`);
    if (ENABLE_WEB_SERVICE)
        logService.info(`Web service is ready \x1b[32m http://localhost:${WEB_PORT} \x1b[0m`);
    if (ENABLE_SOCKET_SERVICE)
        logService.info(`Socket service is ready \x1b[32m http://localhost:${SOCKET_PORT} \x1b[0m`);
};

const start = async () => {
    if (IS_DEVELOPMENT) {
        logService.info('Starting project \x1b[1m\x1b[96m' + PROJECT_NAME + '\x1b[0m\x1b[21m with \x1b[32mdevelopment\x1b[0m mode...');

        await startApplication();
        await runMigrations();
        showServiceStatus();
    }
    else {
        if (cluster.isMaster) {
            logService.info('Starting project \x1b[1m\x1b[96m' + PROJECT_NAME + '\x1b[0m\x1b[21m...');
            showServiceStatus();

            const numCPUs = os.cpus().length;
            // Fork workers.
            for (let i = 0; i < numCPUs; i++)
                cluster.fork();

            cluster.on('exit', worker => {
                cluster.fork();
                logService.error(`Worker ${worker.process.pid} is died.`);
            });
            logService.info(`Master ${process.pid} is started.`);
        }
        else {
            try {
                await startApplication();
                logService.info(`Worker ${process.pid} is started.`);
            }
            catch (error) {
                logService.error('\x1b[31m', error.message, '\x1b[0m');
                await dbContext.destroyConnection();
                setTimeout(() => process.exit(), 2000);
            }
        }
    }
};
start();
