/* eslint-disable @typescript-eslint/no-use-before-define */
import { DB_CACHING_HOST, DB_CACHING_PASSWORD, DB_CACHING_PORT, DB_CACHING_PREFIX } from 'config/Configuration';
import redis from 'redis';
import rediss from 'redis-commands';
import { IRedisClient } from 'shared/database/interfaces/IRedisClient';
import { IRedisContext } from 'shared/database/interfaces/IRedisContext';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectDb } from 'shared/types/Injection';
import { Service } from 'typedi';

@Service(InjectDb.RedisContext)
export class RedisContext implements IRedisContext {
    private _connection?: IRedisClient;

    constructor(connection?: IRedisClient) {
        if (connection)
            this._connection = connection;
    }

    get redisClient(): IRedisClient {
        if (!this._connection)
            throw new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'redis_connection' });
        return this._connection;
    }

    createConnection(redisLib = redis): IRedisClient {
        if (this._connection && this._connection.connected)
            return this._connection;

        this._connection = promisifyRedis(redisLib).createClient({
            host: DB_CACHING_HOST,
            port: DB_CACHING_PORT,
            password: DB_CACHING_PASSWORD,
            prefix: DB_CACHING_PREFIX
        } as redis.ClientOpts) as IRedisClient;
        return this._connection;
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const promisifyRedis = (redis) => {
    const mlproto = redis.Multi.prototype;
    const clproto = redis.RedisClient.prototype;

    const promisify = (f) => {
        return function() {
            // eslint-disable-next-line prefer-rest-params
            const args = Array.prototype.slice.call(arguments);
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const that = this;
            if (typeof args[args.length - 1] === 'function') {
                // Okay. Someone supplied a callback. Most likely some internal
                // node-redis call (ready probe etc.). Oh, as a result of
                // supporting internal callback-style calls, one can now use
                // promise-redis as a dropin replacement for node-redis.
                return f.apply(this, args);
            }
            else {
                return promiseFactory(function(resolve, reject) {
                    args.push(createCb(resolve, reject));
                    f.apply(that, args);
                });
            }
        };
    };

    rediss.list.forEach(function(full) {
        const cmd = full.split(' ')[0];

        if (cmd !== 'multi') {
            clproto[cmd + 'Async'] = promisify(clproto[cmd]);
            clproto[cmd.toUpperCase() + 'ASYNC'] = clproto[cmd + 'Async'];
        }
    });

    // For Multi only `exec` command returns promise.
    mlproto.exec_transaction = promisify(mlproto.exec_transaction);
    mlproto.exec = mlproto.exec_transaction;
    mlproto.EXEC = mlproto.exec;

    return redis;
};

const createCb = (resolve, reject) => {
    return function(err, value) {
        if (err)
            reject(err);
        else
            resolve(value);
    };
};

const promiseFactory = (resolver): Promise<any> => {
    return new Promise(resolver);
};
