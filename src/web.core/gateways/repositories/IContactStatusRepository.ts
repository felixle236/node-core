export interface IContactStatusRepository {
    getListOnlineStatus(): Promise<string[]>;

    getListNewMessageStatus(roomOrReceiverId: string): Promise<string[]>;

    addOnlineStatus(memberId: string): Promise<boolean>;

    addNewMessageStatus(senderId: string, roomOrReceiverId: string): Promise<boolean>;

    removeOnlineStatus(memberId: string): Promise<boolean>;

    removeNewMessageStatus(receiverId: string, roomOrSenderId: string): Promise<boolean>;
}
