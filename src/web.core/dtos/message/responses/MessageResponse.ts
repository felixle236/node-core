import { Message } from '../../../models/Message';
import { UserResponse } from '../../user/responses/UserResponse';
import { mapModel } from '../../../../libs/common';

export class MessageResponse {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    senderId: number;
    receiverId: number;
    room: number;
    content: string;

    sender?: UserResponse;
    receiver?: UserResponse;

    constructor(model: Message) {
        this.id = model.id;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
        this.senderId = model.senderId;
        this.receiverId = model.receiverId!;
        this.room = model.room;
        this.content = model.content;

        this.sender = mapModel(UserResponse, model.sender);
        this.receiver = mapModel(UserResponse, model.receiver);
    }
}
