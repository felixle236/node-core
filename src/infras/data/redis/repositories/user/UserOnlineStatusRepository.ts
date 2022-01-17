import { IUserOnlineStatusRepository } from 'application/interfaces/repositories/user/IUserOnlineStatusRepository';
import { DB_CACHING_PREFIX } from 'config/Configuration';
import { IRedisContext } from 'shared/database/interfaces/IRedisContext';
import { InjectDb, InjectRepository } from 'shared/types/Injection';
import { Inject, Service } from 'typedi';

@Service(InjectRepository.UserOnlineStatus)
export class UserOnlineStatusRepository implements IUserOnlineStatusRepository {
  private readonly _onlineStatusKey = DB_CACHING_PREFIX + 'user_online_status';

  constructor(@Inject(InjectDb.RedisContext) private readonly _redisContext: IRedisContext) {}

  async getListOnlineStatusByIds(ids: string[]): Promise<string[]> {
    return await this._redisContext.getConnection().HMGET(this._onlineStatusKey, ids);
  }

  async updateUserOnlineStatus(id: string, data: string): Promise<boolean> {
    const result = await this._redisContext.getConnection().HSET(this._onlineStatusKey, id, data);
    return !!result;
  }

  async demoAddKeyWithExpireTime(id: string, data: string, expireSecond: number = 24 * 60 * 60): Promise<boolean> {
    const result = await this._redisContext.getConnection().SET(id, data, { EX: expireSecond });
    return result === 'OK';
  }
}
