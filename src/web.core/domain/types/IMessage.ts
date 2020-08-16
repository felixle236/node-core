import { IEntity } from './base/IEntity';
import { IUser } from './IUser';

export interface IMessage extends IEntity {
    id: number;
    senderId: number;
    receiverId?: number;
    room: number;
    content: string;

    sender?: IUser;
    receiver?: IUser;
}
