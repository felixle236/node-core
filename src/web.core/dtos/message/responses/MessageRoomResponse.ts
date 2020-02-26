import { Message } from '../../../models/Message';
import { UserResponse } from '../../user/responses/UserResponse';

export class MessageRoomResponse {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    senderId: number;
    room: number;
    content: string;

    sender?: UserResponse;

    constructor(model: Message) {
        this.id = model.id;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
        this.senderId = model.senderId;
        this.room = model.room;
        this.content = model.content;

        this.sender = model.sender && new UserResponse(model.sender);
    }
}
