export interface IUserOnlineStatusRepository {
    getListOnlineStatusByIds(ids: string[]): Promise<string[]>;

    updateUserOnlineStatus(id: string, data: string): Promise<boolean>;

    demoAddKeyWithExpireTime(id: string, data: string): Promise<boolean>;
    demoAddKeyWithExpireTime(id: string, data: string, expireSecond: number): Promise<boolean>;
}
