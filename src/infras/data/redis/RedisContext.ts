import { createClient, RedisClientOptions, RedisClientType } from 'redis';
import { IRedisContext } from 'shared/database/interfaces/IRedisContext';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectDb } from 'shared/types/Injection';
import { Service } from 'typedi';

@Service(InjectDb.RedisContext)
export class RedisContext implements IRedisContext {
  private _redisClient?: RedisClientType<any, any>;

  constructor(redisClient?: RedisClientType<any, any>) {
    if (redisClient) {
      this._redisClient = redisClient;
    }
  }

  getConnection() {
    if (!this._redisClient || !this._redisClient.isOpen) {
      throw new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'redis_connection' });
    }

    return this._redisClient;
  }

  async createConnection(uri: string, options = {} as RedisClientOptions<any, any>) {
    if (this._redisClient && this._redisClient.isOpen) {
      return this._redisClient;
    }

    options.url = uri;
    this._redisClient = createClient(options);
    await this._redisClient.connect();
    return this._redisClient;
  }

  async destroyConnection() {
    if (this._redisClient && this._redisClient.isOpen) {
      await this._redisClient.disconnect();
    }
  }
}
