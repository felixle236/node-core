import * as validator from 'class-validator';
import { IMessage } from '../interfaces/models/IMessage';
import { MessageCreateData } from '../dtos/message/data/MessageCreateData';
import { SystemError } from '../dtos/common/Exception';
import { User } from './User';
import { mapModel } from '../../libs/common';

export class Message implements IMessage {
    constructor(private readonly _data = {} as IMessage) { }

    get id(): number {
        return this._data.id;
    }

    get createdAt(): Date {
        return this._data.createdAt;
    }

    get updatedAt(): Date {
        return this._data.updatedAt;
    }

    get senderId(): number {
        return this._data.senderId;
    }

    set senderId(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'sender id');
        if (!validator.isPositive(val))
            throw new SystemError(1002, 'sender id');
        this._data.senderId = val;
        this._updateRoom();
    }

    get receiverId(): number | undefined {
        return this._data.receiverId;
    }

    set receiverId(val: number | undefined) {
        if (!validator.isEmpty(val)) {
            if (!validator.isPositive(val))
                throw new SystemError(1002, 'receiver id');
        }

        this._data.receiverId = val;
        this._updateRoom();
    }

    get room(): number {
        return this._data.room;
    }

    set room(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'room');
        if (!validator.isInt(val) || validator.isNegative(val))
            throw new SystemError(1002, 'room');
        if (val !== 0)
            throw new SystemError(1004, 'room');

        if (this._data.receiverId)
            this._data.receiverId = undefined;
        this._data.room = val;
    }

    get content(): string {
        return this._data.content;
    }

    set content(val: string) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'content');
        if (!validator.isString(val))
            throw new SystemError(1002, 'content');
        if (val.length > 2000)
            throw new SystemError(2004, 'content', 2000);

        this._data.content = val;
    }

    /* Relationship */

    get sender(): User | undefined {
        return mapModel(User, this._data.sender);
    }

    get receiver(): User | undefined {
        return mapModel(User, this._data.receiver);
    }

    /* handlers */

    toCreateData() {
        const data = new MessageCreateData();
        data.senderId = this._data.senderId;
        data.receiverId = this._data.receiverId;
        data.room = this._data.room;
        data.content = this._data.content;
        return data;
    }

    private _updateRoom() {
        if (this._data.senderId && this._data.receiverId)
            this._data.room = Message.generateRoom(this._data.senderId, this._data.receiverId);
    }

    static generateRoom(senderId: number, receiverId: number): number {
        if (senderId > receiverId)
            return Number(this._generateId(senderId) + this._generateId(receiverId));
        else
            return Number(this._generateId(receiverId) + this._generateId(senderId));
    }

    private static _generateId(num: number): string {
        if (num.toString().length >= 4)
            return num.toString();
        return (num * Number('1'.padEnd(5 - num.toString().length, '0'))).toString();
    }
}
