import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IDbEntity } from '../IDbEntity';
import { IMessage } from '../../../../web.core/domain/types/IMessage';
import { Message } from '../../../../web.core/domain/entities/Message';
import { MessageSchema } from '../schemas/MessageSchema';
import { UserDbEntity } from './UserDbEntity';

@Entity(MessageSchema.TABLE_NAME)
export class MessageDbEntity implements IMessage, IDbEntity<Message> {
    @PrimaryGeneratedColumn({ name: MessageSchema.COLUMNS.ID })
    id: number;

    @CreateDateColumn({ name: MessageSchema.COLUMNS.CREATED_AT, type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: MessageSchema.COLUMNS.UPDATED_AT, type: 'timestamptz' })
    updatedAt: Date;

    @Column({ name: MessageSchema.COLUMNS.SENDER_ID })
    senderId: number;

    @Column({ name: MessageSchema.COLUMNS.RECEIVER_ID, nullable: true })
    receiverId?: number;

    @Column({ name: MessageSchema.COLUMNS.ROOM })
    @Index()
    room: number;

    @Column({ name: MessageSchema.COLUMNS.CONTENT, length: 2000 })
    content: string;

    /* Relationship */

    @ManyToOne(() => UserDbEntity, user => user.messageSenders)
    @JoinColumn({ name: MessageSchema.COLUMNS.SENDER_ID })
    sender: UserDbEntity;

    @ManyToOne(() => UserDbEntity, user => user.messageReceivers)
    @JoinColumn({ name: MessageSchema.COLUMNS.RECEIVER_ID })
    receiver: UserDbEntity;

    /* handlers */

    toEntity(): Message {
        return new Message(this);
    }

    fromEntity(entity?: Message): this | undefined {
        if (!entity)
            return;

        if (entity.id !== undefined)
            this.id = entity.id;

        if (entity.senderId !== undefined)
            this.senderId = entity.senderId;

        if (entity.receiverId !== undefined)
            this.receiverId = entity.receiverId;

        if (entity.room !== undefined)
            this.room = entity.room;

        if (entity.content !== undefined)
            this.content = entity.content;

        return this;
    }
}
