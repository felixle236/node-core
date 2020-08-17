import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseDbEntity } from './base/BaseDbEntity';
import { IMessage } from '../../../../web.core/domain/types/IMessage';
import { MESSAGE_SCHEMA } from '../schemas/MessageSchema';
import { Message } from '../../../../web.core/domain/entities/Message';
import { UserDbEntity } from './UserDbEntity';

@Entity(MESSAGE_SCHEMA.TABLE_NAME)
export class MessageDbEntity extends BaseDbEntity<Message> implements IMessage {
    @PrimaryGeneratedColumn('uuid', { name: MESSAGE_SCHEMA.COLUMNS.ID })
    id: string;

    @Column({ name: MESSAGE_SCHEMA.COLUMNS.SENDER_ID })
    senderId: string;

    @Column({ name: MESSAGE_SCHEMA.COLUMNS.RECEIVER_ID, nullable: true })
    receiverId?: string;

    @Column({ name: MESSAGE_SCHEMA.COLUMNS.ROOM })
    @Index()
    room: string;

    @Column({ name: MESSAGE_SCHEMA.COLUMNS.CONTENT, length: 2000 })
    content: string;

    /* Relationship */

    @ManyToOne(() => UserDbEntity, user => user.messageSenders)
    @JoinColumn({ name: MESSAGE_SCHEMA.COLUMNS.SENDER_ID })
    sender: UserDbEntity;

    @ManyToOne(() => UserDbEntity, user => user.messageReceivers)
    @JoinColumn({ name: MESSAGE_SCHEMA.COLUMNS.RECEIVER_ID })
    receiver: UserDbEntity;

    /* handlers */

    toEntity(): Message {
        return new Message(this);
    }

    fromEntity(entity: Message): this {
        const data = entity.toData();

        if (data.id !== undefined)
            this.id = data.id;

        if (data.senderId !== undefined)
            this.senderId = data.senderId;

        if (data.receiverId !== undefined)
            this.receiverId = data.receiverId;

        if (data.room !== undefined)
            this.room = data.room;

        if (data.content !== undefined)
            this.content = data.content;

        return this;
    }
}
