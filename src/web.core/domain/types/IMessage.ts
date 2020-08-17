import { IEntity } from './base/IEntity';
import { IUser } from './IUser';

export interface IMessage extends IEntity {
    id: string;
    senderId: string;
    receiverId?: string;
    room: string;
    content: string;

    sender?: IUser;
    receiver?: IUser;
}
