import { Inject, Service } from 'typedi';
import { IUserOnlineStatusRepository } from '../../../../../web.core/gateways/repositories/user/IUserOnlineStatusRepository';
import { RedisContext } from '../../RedisContext';

@Service('user.online.status.repository')
export class UserOnlineStatusRepository implements IUserOnlineStatusRepository {
    @Inject('redis.context')
    private readonly _redisContext: RedisContext;

    private readonly _onlineStatusKey = 'user_online_status';

    async getListOnlineStatusByIds(ids: string[]): Promise<string[]> {
        const list = await this._redisContext.redisClient.hmgetAsync(this._onlineStatusKey, ids);
        return list;
    }

    async addUserOnlineStatus(id: string): Promise<boolean> {
        const infoUser = JSON.stringify({
            isOnline: true, onlineAt: new Date()
        });
        const result = await this._redisContext.redisClient.hmsetAsync(this._onlineStatusKey, id, infoUser);
        return result === 'OK';
    }

    async removeUserOnlineStatus(id: string): Promise<boolean> {
        const infoUser = JSON.stringify({
            isOnline: false, onlineAt: new Date()
        });
        const result = await this._redisContext.redisClient.hmsetAsync(this._onlineStatusKey, id, infoUser);
        return result === 'OK';
    }
}
