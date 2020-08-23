import { Inject, Service } from 'typedi';
import { IUserStatusRepository } from '../../../../web.core/gateways/repositories/IUserStatusRepository';
import { RedisContext } from '../RedisContext';

@Service('user.status.repository')
export class UserStatusRepository implements IUserStatusRepository {
    @Inject('redis.context')
    private readonly _redisContext: RedisContext;

    private readonly _onlineStatusKey = 'online_status';

    async getListOnlineStatusByIds(ids: string[]): Promise<string[]> {
        const list = await this._redisContext.redisClient.lrangeAsync(this._onlineStatusKey, 0, -1);
        return ids.filter(id => list.indexOf(id) !== -1);
    }

    async addUserOnlineStatus(id: string): Promise<boolean> {
        const list = await this._redisContext.redisClient.lrangeAsync(this._onlineStatusKey, 0, -1);
        if (list.indexOf(id) !== -1)
            return false;

        const result = await this._redisContext.redisClient.lpushAsync(this._onlineStatusKey, id);
        return !!result;
    }

    async removeUserOnlineStatus(id: string): Promise<boolean> {
        const list = await this._redisContext.redisClient.lrangeAsync(this._onlineStatusKey, 0, -1);
        if (list.indexOf(id) === -1)
            return false;

        const result = await this._redisContext.redisClient.lremAsync(this._onlineStatusKey, 1, id);
        return !!result;
    }
}
