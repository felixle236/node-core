import { IRedisClient } from './IRedisClient';

export interface IRedisContext {
    readonly redisClient: IRedisClient;

    createConnection(): IRedisClient;
    createConnection(redisLib: any): IRedisClient;
}
