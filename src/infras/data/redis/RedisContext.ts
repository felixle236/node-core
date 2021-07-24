/* eslint-disable @typescript-eslint/no-use-before-define */
import { DB_CACHING_HOST, DB_CACHING_PASSWORD, DB_CACHING_PORT, DB_CACHING_PREFIX } from '@configs/Configuration';
import { IRedisClient } from '@shared/database/interfaces/IRedisClient';
import { IRedisContext } from '@shared/database/interfaces/IRedisContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import redis from 'redis';
import redisCommands from 'redis-commands';
import { Service } from 'typedi';

@Service('redis.context')
export class RedisContext implements IRedisContext {
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

const promiseFactory = (resolver): Promise<any> => {
    return new Promise(resolver);
};
