import { Inject, Service } from 'typedi';
import { IUserOnlineStatusRepository } from '../../../../../web.core/gateways/repositories/user/IUserOnlineStatusRepository';
import { RedisContext } from '../../RedisContext';

@Service('user.online.status.repository')
export class UserOnlineStatusRepository implements IUserOnlineStatusRepository {
    @Inject('redis.context')
    private readonly _redisContext: RedisContext;

    private readonly _onlineStatusKey = 'user_online_status';

    async getListOnlineStatusByIds(ids: string[]): Promise<string[]> {
        return await this._redisContext.redisClient.hmgetAsync(this._onlineStatusKey, ids);
    }

    async updateUserOnlineStatus(id: string, data: string): Promise<boolean> {
        const result = await this._redisContext.redisClient.hmsetAsync(this._onlineStatusKey, id, data);
        return result === 'OK';
    }

    async demoAddKeyWithExpireTime(id: string, data: string, expireSecond: number = 24 * 60 * 60): Promise<boolean> {
        const result = await this._redisContext.redisClient.setAsync(id, data, 'EX', expireSecond);
        return result === 'OK';
    }
}
