import { IUser } from './IUser';

export interface IMessage {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    senderId: number;
    receiverId?: number;
    room: number;
    content: string;

    sender?: IUser;
    receiver?: IUser;
}
