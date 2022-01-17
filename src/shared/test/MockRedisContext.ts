import { RedisContext } from 'infras/data/redis/RedisContext';
import { RedisClientType } from 'redis';
import redisMock from 'redis-mock';

export const mockRedisClient = (): RedisClientType<Record<string, never>, Record<string, never>> => {
  const redisClient = redisMock.createClient() as any;
  redisClient.isOpen = true;
  redisClient.disconnect = redisClient.end;
  return redisClient;
};

export const mockRedisContext = (redisClient = mockRedisClient()): RedisContext => {
  return new RedisContext(redisClient as any);
};
