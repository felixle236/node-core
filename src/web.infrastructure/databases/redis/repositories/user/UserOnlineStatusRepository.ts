import { Inject, Service } from 'typedi';
import { IUserOnlineStatusRepository } from '../../../../../web.core/gateways/repositories/user/IUserOnlineStatusRepository';
import { RedisContext } from '../../RedisContext';

@Service('user.online.status.repository')
export class UserOnlineStatusRepository implements IUserOnlineStatusRepository {
    @Inject('redis.context')
    private readonly _redisContext: RedisContext;

    private readonly _onlineStatusKey = 'user_online_status';

    async getListOnlineStatusByIds(ids: string[]): Promise<string[]> {
        const list = await this._redisContext.redisClient.mgetAsync(ids.map(id => `${this._onlineStatusKey}:${id}`));
        return list.filter(item => !!item);
    }

    async addUserOnlineStatus(id: string, expireSecond: number = 24 * 60 * 60): Promise<boolean> {
        const key = `${this._onlineStatusKey}:${id}`;
        const data = await this._redisContext.redisClient.getAsync(key);
        if (!data) {
            const result = await this._redisContext.redisClient.setAsync(key, id, 'EX', expireSecond);
            return result === 'OK';
        }
        return true;
    }

    async removeUserOnlineStatus(id: string): Promise<boolean> {
        const key = `${this._onlineStatusKey}:${id}`;
        const data = await this._redisContext.redisClient.getAsync(key);
        if (data) {
            const result = await this._redisContext.redisClient.delAsync(key);
            return !!result;
        }
        return true;
    }
}
