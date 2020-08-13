import { Message } from '../../../domain/entities/Message';
import { User } from '../../../domain/entities/User';

export class CreateMessageGroupOutput {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    senderId: number;
    receiverId?: number;
    room: number;
    content: string;

    sender?: UserOutput;
    receiver?: UserOutput;

    constructor(data: Message) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.senderId = data.senderId;
        this.receiverId = data.receiverId;
        this.room = data.room;
        this.content = data.content;

        if (data.sender)
            this.sender = new UserOutput(data.sender);

        if (data.receiver)
            this.receiver = new UserOutput(data.receiver);
    }
}

class UserOutput {
    id: number;
    firstName: string;
    lastName?: string;

    constructor(data: User) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
    }
}
