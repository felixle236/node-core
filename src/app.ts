import './infras/AliasRegister';
import './infras/SingletonRegister';
import cluster from 'cluster';
import os from 'os';
import { API_PORT, ENABLE_API_SERVICE, ENABLE_SOCKET_SERVICE, ENABLE_WEB_SERVICE, ENVIRONMENT, PROJECT_NAME, SOCKET_PORT, WEB_PORT } from '@configs/Configuration';
import { Environment } from '@configs/Constants';
import { ILogService } from '@gateways/services/ILogService';
import { ApiService } from '@infras/web.api/ApiService';
import { SocketService } from '@infras/web.socket/SocketService';
import { WebService } from '@infras/web.ui/WebService';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { IRedisContext } from '@shared/database/interfaces/IRedisContext';
import { Container } from 'typedi';

const logService = Container.get<ILogService>('log.service');
const dbContext = Container.get<IDbContext>('db.context');
const redisContext = Container.get<IRedisContext>('redis.context');

const startApplication = async (): Promise<void> => {
    redisContext.createConnection();
    await dbContext.createConnection();

    if (ENABLE_API_SERVICE)
        ApiService.init();

    if (ENABLE_WEB_SERVICE)
        WebService.init();

    if (ENABLE_SOCKET_SERVICE)
        SocketService.init();
};

const runMigrations = async (): Promise<void> => {
    logService.info('Run migrations...');
    const conn = dbContext.getConnection();
    const migrations = await conn.runMigrations();
    if (!migrations.length)
        logService.info('Not found new migration.');
    migrations.forEach(migration => logService.info('Migrated: \x1b[32m' + migration.name + '\x1b[0m\n'));
};

const showServiceStatus = (): void => {
    if (ENABLE_API_SERVICE)
        logService.info(`Api service is ready \x1b[32m http://localhost:${API_PORT} \x1b[0m`);

    if (ENABLE_WEB_SERVICE)
        logService.info(`Web service is ready \x1b[32m http://localhost:${WEB_PORT} \x1b[0m`);

    if (ENABLE_SOCKET_SERVICE)
        logService.info(`Socket service is ready \x1b[32m http://localhost:${SOCKET_PORT} \x1b[0m`);
};

if (ENVIRONMENT === Environment.LOCAL) {
    logService.info('Starting project \x1b[1m\x1b[96m' + PROJECT_NAME + '\x1b[0m\x1b[21m with \x1b[32mdevelopment\x1b[0m mode...');

    startApplication().then(async () => {
        await runMigrations();
        showServiceStatus();
    });
}
else {
    if (cluster.isMaster) {
        logService.info('Starting project ' + PROJECT_NAME + '...');
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
    else if (cluster.isWorker) {
        startApplication().then(() => {
            logService.info(`Worker ${process.pid} is started.`);
        }).catch((error: Error) => {
            logService.error(error.stack || error.message);
            dbContext.destroyConnection();
            setTimeout(() => process.exit(), 2000);
        });
    }
}
