import * as validator from 'class-validator';
import { BaseEntity } from './base/BaseEntity';
import { IMessage } from '../types/IMessage';
import { MessageError } from '../common/exceptions/message/MessageError';
import { SystemError } from '../common/exceptions/SystemError';
import { User } from './User';

export class Message extends BaseEntity<IMessage> implements IMessage {
    constructor(data?: IMessage) {
        super(data);
    }

    get id(): string {
        return this.data.id;
    }

    get senderId(): string {
        return this.data.senderId;
    }

    set senderId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'sender id');
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'sender id');
        this.data.senderId = val;
        this._updateRoom();
    }

    get receiverId(): string | undefined {
        return this.data.receiverId;
    }

    set receiverId(val: string | undefined) {
        if (val) {
            if (!validator.isUUID(val))
                throw new SystemError(MessageError.PARAM_INVALID, 'receiver id');
        }

        this.data.receiverId = val;
        this._updateRoom();
    }

    get room(): string {
        return this.data.room;
    }

    set room(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'room');
        if (!validator.isString(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'room');
        if (val !== '0')
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'room');

        if (this.data.receiverId)
            this.data.receiverId = undefined;
        this.data.room = val;
    }

    get content(): string {
        return this.data.content;
    }

    set content(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'content');
        if (!validator.isString(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'content');
        if (val.length > 2000)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'content', 2000);

        this.data.content = val;
    }

    /* Relationship */

    get sender(): User | undefined {
        return this.data.sender && new User(this.data.sender);
    }

    get receiver(): User | undefined {
        return this.data.receiver && new User(this.data.receiver);
    }

    /* handlers */

    private _updateRoom() {
        if (this.data.senderId && this.data.receiverId)
            this.data.room = this.data.senderId > this.data.receiverId ? `${this.data.senderId}:${this.data.receiverId}` : `${this.data.receiverId}:${this.data.senderId}`;
    }
}
