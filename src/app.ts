import 'infras/SingletonRegister';
import cluster from 'cluster';
import os from 'os';
import { ILogService } from 'application/interfaces/services/ILogService';
import {
  DB_CACHING_URI,
  ENABLE_MOBILE_API,
  ENABLE_SWAGGER_UI,
  ENABLE_WEB_API,
  ENABLE_WEB_SOCKET,
  ENABLE_WEB_UI,
  ENVIRONMENT,
  MOBILE_API_PORT,
  MOBILE_API_URL,
  PROJECT_NAME,
  SWAGGER_UI_PORT,
  SWAGGER_UI_URL,
  WEB_API_PORT,
  WEB_API_URL,
  WEB_SOCKET_PORT,
  WEB_SOCKET_URL,
  WEB_UI_PORT,
  WEB_UI_URL,
} from 'config/Configuration';
import { ApiService as MobileApiService } from 'exposes/api/mobile/ApiService';
import { ApiService as WebApiService } from 'exposes/api/web/ApiService';
import { SocketService } from 'exposes/socket/SocketService';
import { ApiService as DocApiService } from 'exposes/ui/doc/ApiService';
import { WebService } from 'exposes/ui/web/WebService';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { IRedisContext } from 'shared/database/interfaces/IRedisContext';
import { configureI18n } from 'shared/localization/Localization';
import { Environment } from 'shared/types/Environment';
import { InjectDb, InjectService } from 'shared/types/Injection';
import Container from 'typedi';

const logService = Container.get<ILogService>(InjectService.Log);
const dbContext = Container.get<IDbContext>(InjectDb.DbContext);
const redisContext = Container.get<IRedisContext>(InjectDb.RedisContext);

const startApplication = async (): Promise<void> => {
  configureI18n(['en']);
  await redisContext.createConnection(DB_CACHING_URI);
  await dbContext.createConnection();

  if (ENABLE_WEB_API) {
    WebApiService.init(WEB_API_PORT);
  }

  if (ENABLE_MOBILE_API) {
    MobileApiService.init(MOBILE_API_PORT);
  }

  if (ENABLE_SWAGGER_UI) {
    DocApiService.init(SWAGGER_UI_PORT);
  }

  if (ENABLE_WEB_UI) {
    WebService.init(WEB_UI_PORT);
  }

  if (ENABLE_WEB_SOCKET) {
    SocketService.init(WEB_SOCKET_PORT);
  }
};

const runMigrations = async (): Promise<void> => {
  logService.info('Run migrations...\n');
  const conn = dbContext.getConnection();
  const migrations = await conn.runMigrations();
  if (!migrations.length) {
    logService.info('Not found new migration.\n');
  }
  migrations.forEach((migration) => logService.info('Migrated: \x1b[32m' + migration.name + '\x1b[0m\n'));
};

const showServiceStatus = (): void => {
  if (ENABLE_WEB_API) {
    logService.info(`Web API is ready \x1b[32m ${WEB_API_URL} \x1b[0m\n`);
  }

  if (ENABLE_MOBILE_API) {
    logService.info(`Mobile API is ready \x1b[32m ${MOBILE_API_URL} \x1b[0m\n`);
  }

  if (ENABLE_SWAGGER_UI) {
    logService.info(`Swagger UI is ready \x1b[32m ${SWAGGER_UI_URL} \x1b[0m\n`);
  }

  if (ENABLE_WEB_UI) {
    logService.info(`Web UI is ready \x1b[32m ${WEB_UI_URL} \x1b[0m\n`);
  }

  if (ENABLE_WEB_SOCKET) {
    logService.info(`Web Socket is ready \x1b[32m ${WEB_SOCKET_URL} \x1b[0m\n`);
  }

  logService.info(`Project \x1b[1m\x1b[96m${PROJECT_NAME}\x1b[0m has started with \x1b[1m\x1b[32m${ENVIRONMENT}\x1b[0m environment...\n`);
};

if (ENVIRONMENT === Environment.Local) {
  logService.info(`Starting project \x1b[1m\x1b[96m${PROJECT_NAME}\x1b[0m with \x1b[1m\x1b[32m${ENVIRONMENT}\x1b[0m environment...\n`);

  startApplication().then(async () => {
    await runMigrations();
    showServiceStatus();
  });
} else {
  if (cluster.isMaster || cluster.isPrimary) {
    logService.info('Starting project ' + PROJECT_NAME + ` with ${ENVIRONMENT} environment...`);
    showServiceStatus();

    const numCPUs = os.cpus().length;
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      cluster.fork();
      logService.error(`Worker ${worker.process.pid} is died.`);
    });
    logService.info(`Master ${process.pid} is started.`);
  } else if (cluster.isWorker) {
    startApplication()
      .then(() => {
        logService.info(`Worker ${process.pid} is started.`);
      })
      .catch((error: Error) => {
        logService.error(error.stack || error.message);
        dbContext.destroyConnection();
        setTimeout(() => process.exit(), 2000);
      });
  }
}
