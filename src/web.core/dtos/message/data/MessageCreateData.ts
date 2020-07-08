export class MessageCreateData {
    senderId: number;
    receiverId?: number;
    room: number;
    content: string;
}
