export interface IUserOnlineStatusRepository {
    getListOnlineStatusByIds(ids: string[]): Promise<string[]>;

    addUserOnlineStatus(id: string): Promise<boolean>;
    addUserOnlineStatus(id: string, expireSecond: number): Promise<boolean>;

    removeUserOnlineStatus(id: string): Promise<boolean>;
}
