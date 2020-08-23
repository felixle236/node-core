export interface IUserStatusRepository {
    getListOnlineStatusByIds(ids: string[]): Promise<string[]>;

    addUserOnlineStatus(id: string): Promise<boolean>;

    removeUserOnlineStatus(id: string): Promise<boolean>;
}
