import { Container } from 'typedi';
import { IMessage } from '../interfaces/models/IMessage';
import { SystemError } from '../dtos/common/Exception';
import { User } from './User';
import { Validator } from 'class-validator';
import { mapModel } from '../../libs/common';
const validator = Container.get(Validator);

export class Message implements IMessage {
    constructor(private data = {} as IMessage) { }

    get id(): number {
        return this.data.id;
    }

    get createdAt(): Date {
        return this.data.createdAt;
    }

    get updatedAt(): Date {
        return this.data.updatedAt;
    }

    get senderId(): number {
        return this.data.senderId;
    }

    set senderId(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'sender id');
        if (!validator.isPositive(val))
            throw new SystemError(1002, 'sender id');
        this.data.senderId = val;
        this.updateRoom();
    }

    get receiverId(): number | undefined {
        return this.data.receiverId;
    }

    set receiverId(val: number | undefined) {
        if (!validator.isEmpty(val)) {
            if (!validator.isPositive(val))
                throw new SystemError(1002, 'receiver id');
        }

        this.data.receiverId = val;
        this.updateRoom();
    }

    get room(): number {
        return this.data.room;
    }

    set room(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'room');
        if (!validator.isInt(val) || validator.isNegative(val))
            throw new SystemError(1002, 'room');
        if (val !== 0)
            throw new SystemError(1004, 'room');

        if (this.data.receiverId)
            this.data.receiverId = undefined;
        this.data.room = val;
    }

    get content(): string {
        return this.data.content;
    }

    set content(val: string) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'content');
        if (!validator.isString(val))
            throw new SystemError(1002, 'content');
        if (val.length > 2000)
            throw new SystemError(2004, 'content', 2000);

        this.data.content = val;
    }

    /* Relationship */

    get sender(): User | undefined {
        return mapModel(User, this.data.sender);
    }

    get receiver(): User | undefined {
        return mapModel(User, this.data.receiver);
    }

    /* handlers */

    toData() {
        const data = {} as IMessage;
        data.senderId = this.data.senderId;
        data.receiverId = this.data.receiverId;
        data.room = this.data.room;
        data.content = this.data.content;
        return data;
    }

    private updateRoom() {
        if (this.data.senderId && this.data.receiverId)
            this.data.room = Message.generateRoom(this.data.senderId, this.data.receiverId);
    }

    static generateRoom(senderId: number, receiverId: number): number {
        if (senderId > receiverId)
            return Number(this.generateId(senderId) + this.generateId(receiverId));
        else
            return Number(this.generateId(receiverId) + this.generateId(senderId));
    }

    private static generateId(num: number): string {
        if (num.toString().length >= 4)
            return num.toString();
        return (num * Number('1'.padEnd(5 - num.toString().length, '0'))).toString();
    }
}
