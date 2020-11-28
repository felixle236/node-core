import * as redis from 'redis';
import * as redisCommands from 'redis-commands';
import { REDIS_CONFIG_HOST, REDIS_CONFIG_PASSWORD, REDIS_CONFIG_PORT, REDIS_CONFIG_PREFIX } from '../../../configs/Configuration';
import { IRedisClient } from '../../../web.core/domain/common/IRedisClient';
import { MessageError } from '../../../web.core/domain/common/exceptions/message/MessageError';
import { Service } from 'typedi';
import { SystemError } from '../../../web.core/domain/common/exceptions/SystemError';

@Service('redis.context')
export class RedisContext {
    private _connection: IRedisClient;

    constructor(connection?: IRedisClient) {
        if (connection) this._connection = connection;
    }

    get redisClient(): IRedisClient {
        if (!this._connection)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'redis connection');
        return this._connection;
    }

    createConnection(redisLib = redis): IRedisClient {
        if (this._connection && this._connection.connected)
            return this._connection;

        this._connection = promisifyRedis(redisLib).createClient(REDIS_CONFIG_PORT, REDIS_CONFIG_HOST, {
            password: REDIS_CONFIG_PASSWORD,
            prefix: REDIS_CONFIG_PREFIX
        }) as IRedisClient;
        return this._connection;
    }
}

const promisifyRedis = (redis) => {
    const mlproto = redis.Multi.prototype;
    const clproto = redis.RedisClient.prototype;

    const promisify = (f) => {
        return function() {
            const args = Array.prototype.slice.call(arguments);
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

    redisCommands.list.forEach(function(fullCommand) {
        const cmd = fullCommand.split(' ')[0];

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
        if (err !== null)
            reject(err);

        else
            resolve(value);
    };
};

const promiseFactory = (resolver) => {
    return new Promise(resolver);
};
