import { IRedisClient } from 'shared/database/interfaces/IRedisClient';
import { IRedisContext } from 'shared/database/interfaces/IRedisContext';
import { mockFunction } from './MockFunction';

export const mockRedisContext = (): IRedisContext => {
    return {
        redisClient: {
            hmgetAsync: mockFunction(),
            hmsetAsync: mockFunction(),
            setAsync: mockFunction()
        } as unknown as IRedisClient
    } as IRedisContext;
};
