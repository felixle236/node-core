export interface IContactStatusRepository {
    getListOnlineStatus(): Promise<number[]>;

    getListNewMessageStatus(roomOrReceiverId: number): Promise<number[]>;

    addOnlineStatus(memberId: number): Promise<boolean>;

    addNewMessageStatus(senderId: number, roomOrReceiverId: number): Promise<boolean>;

    removeOnlineStatus(memberId: number): Promise<boolean>;

    removeNewMessageStatus(receiverId: number, roomOrSenderId: number): Promise<boolean>;
}
