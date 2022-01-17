import { RedisClientOptions, RedisClientType } from 'redis';

export interface IRedisContext {
  /**
   * Get redis connection.
   * The `createConnection` function must be called before it can be used.
   */
  getConnection(): RedisClientType<any, any>;

  /**
   * Create redis connection.
   * @param uri URI connection string.
   */
  createConnection(uri: string): Promise<RedisClientType<any, any>>;

  /**
   * Create redis connection.
   * @param uri URI connection string.
   * @param options Connection options.
   */
  createConnection(uri: string, options: RedisClientOptions<any, any>): Promise<RedisClientType<any, any>>;

  /**
   * Destroy redis connection.
   */
  destroyConnection(): Promise<void>;
}
