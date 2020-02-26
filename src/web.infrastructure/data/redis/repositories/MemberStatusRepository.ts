import { Inject, Service } from 'typedi';
import { IMemberStatusRepository } from '../../../../web.core/interfaces/gateways/data/IMemberStatusRepository';
import { RedisContext } from '../RedisContext';

@Service('member.status.repository')
export class MemberStatusRepository implements IMemberStatusRepository {
    private readonly onlineStatusKey = 'online_status';
    private readonly newMessageStatusKey = 'new_message_status';

    @Inject('redis.context')
    private readonly redisContext: RedisContext;

    async getListOnlineStatus(): Promise<number[]> {
        const list = await this.redisContext.redisClient.lrangeAsync(this.onlineStatusKey, 0, -1);
        return list.map(item => parseInt(item));
    }

    async getListNewMessageStatus(roomOrReceiverId: number): Promise<number[]> {
        const result = await this.redisContext.redisClient.hgetAsync(this.newMessageStatusKey, roomOrReceiverId.toString());
        return !result ? [] : JSON.parse(result) as number[];
    }

    async addOnlineStatus(memberId: number): Promise<boolean> {
        const list = await this.getListOnlineStatus();
        if (list.indexOf(memberId) !== -1)
            return false;

        const result = await this.redisContext.redisClient.lpushAsync(this.onlineStatusKey, memberId.toString());
        return !!result;
    }

    async addNewMessageStatus(senderId: number, roomOrReceiverId: number): Promise<boolean> {
        const list = await this.getListNewMessageStatus(roomOrReceiverId);
        if (list.indexOf(senderId) !== -1)
            return false;

        list.push(senderId);
        const result = await this.redisContext.redisClient.hsetAsync(this.newMessageStatusKey, roomOrReceiverId.toString(), JSON.stringify(list));
        return !!result;
    }

    async removeOnlineStatus(memberId: number): Promise<boolean> {
        const list = await this.getListOnlineStatus();
        if (list.indexOf(memberId) === -1)
            return false;

        const result = await this.redisContext.redisClient.lremAsync(this.onlineStatusKey, 1, memberId.toString());
        return !!result;
    }

    async removeNewMessageStatus(receiverId: number, roomOrSenderId: number): Promise<boolean> {
        const list = await this.getListNewMessageStatus(receiverId);
        if (list.indexOf(roomOrSenderId) === -1)
            return false;

        list.splice(list.indexOf(roomOrSenderId), 1);
        const result = await this.redisContext.redisClient.hsetAsync(this.newMessageStatusKey, receiverId.toString(), JSON.stringify(list));
        return !!result;
    }
}
