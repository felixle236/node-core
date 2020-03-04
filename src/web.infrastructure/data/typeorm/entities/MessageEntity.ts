import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IMessage } from '../../../../web.core/interfaces/models/IMessage';
import { MessageSchema } from '../schemas/MessageSchema';
import { UserEntity } from './UserEntity';

@Entity(MessageSchema.TABLE_NAME)
export class MessageEntity implements IMessage {
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

    @ManyToOne(() => UserEntity, user => user.messageSenders)
    @JoinColumn({ name: MessageSchema.COLUMNS.SENDER_ID })
    sender: UserEntity;

    @ManyToOne(() => UserEntity, user => user.messageReceivers)
    @JoinColumn({ name: MessageSchema.COLUMNS.RECEIVER_ID })
    receiver: UserEntity;
}
