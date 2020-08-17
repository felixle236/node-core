import { Inject, Service } from 'typedi';
import { IContactStatusRepository } from '../../../../web.core/gateways/repositories/IContactStatusRepository';
import { RedisContext } from '../RedisContext';

@Service('contact.status.repository')
export class ContactStatusRepository implements IContactStatusRepository {
    @Inject('redis.context')
    private readonly _redisContext: RedisContext;

    private readonly _onlineStatusKey = 'online_status';
    private readonly _newMessageStatusKey = 'new_message_status';

    async getListOnlineStatus(): Promise<string[]> {
        return await this._redisContext.redisClient.lrangeAsync(this._onlineStatusKey, 0, -1);
    }

    async getListNewMessageStatus(roomOrReceiverId: string): Promise<string[]> {
        const result = await this._redisContext.redisClient.hgetAsync(this._newMessageStatusKey, roomOrReceiverId);
        return !result ? [] : JSON.parse(result) as string[];
    }

    async addOnlineStatus(memberId: string): Promise<boolean> {
        const list = await this.getListOnlineStatus();
        if (list.indexOf(memberId) !== -1)
            return false;

        const result = await this._redisContext.redisClient.lpushAsync(this._onlineStatusKey, memberId);
        return !!result;
    }

    async addNewMessageStatus(senderId: string, roomOrReceiverId: string): Promise<boolean> {
        const list = await this.getListNewMessageStatus(roomOrReceiverId);
        if (list.indexOf(senderId) !== -1)
            return false;

        list.push(senderId);
        const result = await this._redisContext.redisClient.hsetAsync(this._newMessageStatusKey, roomOrReceiverId, JSON.stringify(list));
        return !!result;
    }

    async removeOnlineStatus(memberId: string): Promise<boolean> {
        const list = await this.getListOnlineStatus();
        if (list.indexOf(memberId) === -1)
            return false;

        const result = await this._redisContext.redisClient.lremAsync(this._onlineStatusKey, 1, memberId);
        return !!result;
    }

    async removeNewMessageStatus(receiverId: string, roomOrSenderId: string): Promise<boolean> {
        const list = await this.getListNewMessageStatus(receiverId);
        if (list.indexOf(roomOrSenderId) === -1)
            return false;

        list.splice(list.indexOf(roomOrSenderId), 1);
        const result = await this._redisContext.redisClient.hsetAsync(this._newMessageStatusKey, receiverId, JSON.stringify(list));
        return !!result;
    }
}
