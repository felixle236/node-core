import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DateTransformer } from '../transformers/DateTransformer';
import { Gender } from '../../../../constants/Enums';
import { IUser } from '../../../../web.core/interfaces/models/IUser';
import { MessageEntity } from './MessageEntity';
import { RoleEntity } from './RoleEntity';
import { UserSchema } from '../schemas/UserSchema';

@Entity(UserSchema.TABLE_NAME)
@Index((user: UserEntity) => [user.email, user.deletedAt], { unique: true })
export class UserEntity implements IUser {
    @PrimaryGeneratedColumn({ name: UserSchema.COLUMNS.ID })
    id: number;

    @CreateDateColumn({ name: UserSchema.COLUMNS.CREATED_AT, type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: UserSchema.COLUMNS.UPDATED_AT, type: 'timestamptz' })
    updatedAt: Date;

    @DeleteDateColumn({ name: UserSchema.COLUMNS.DELETED_AT, type: 'timestamptz', nullable: true })
    deletedAt?: Date;

    @Column({ name: UserSchema.COLUMNS.ROLE_ID })
    roleId: number;

    @Column({ name: UserSchema.COLUMNS.FIRST_NAME, length: 20 })
    firstName: string;

    @Column({ name: UserSchema.COLUMNS.LAST_NAME, length: 20, nullable: true })
    lastName?: string;

    @Column({ name: UserSchema.COLUMNS.EMAIL, length: 120 })
    email: string;

    @Column({ name: UserSchema.COLUMNS.PASSWORD, length: 32 })
    password: string;

    @Column({ name: UserSchema.COLUMNS.AVATAR, length: 200, nullable: true })
    avatar?: string;

    @Column('smallint', { name: UserSchema.COLUMNS.GENDER, nullable: true })
    gender?: Gender;

    @Column('date', { name: UserSchema.COLUMNS.BIRTHDAY, nullable: true, transformer: new DateTransformer() })
    birthday?: Date;

    @Column({ name: UserSchema.COLUMNS.PHONE, length: 20, nullable: true })
    phone?: string;

    @Column({ name: UserSchema.COLUMNS.ADDRESS, length: 200, nullable: true })
    address?: string;

    @Column({ name: UserSchema.COLUMNS.CULTURE, length: 5, nullable: true })
    culture?: string;

    @Column({ name: UserSchema.COLUMNS.CURRENCY, length: 3, nullable: true })
    currency?: string;

    @Index({ unique: true })
    @Column({ name: UserSchema.COLUMNS.ACTIVE_KEY, length: 64, nullable: true })
    activeKey?: string;

    @Column('timestamptz', { name: UserSchema.COLUMNS.ACTIVE_EXPIRE, nullable: true })
    activeExpire?: Date;

    @Column('timestamptz', { name: UserSchema.COLUMNS.ACTIVED_AT, nullable: true })
    activedAt?: Date;

    @Index({ unique: true })
    @Column({ name: UserSchema.COLUMNS.FORGOT_KEY, length: 64, nullable: true })
    forgotKey?: string;

    @Column('timestamptz', { name: UserSchema.COLUMNS.FORGOT_EXPIRE, nullable: true })
    forgotExpire?: Date;

    /* Relationship */

    @ManyToOne(() => RoleEntity, role => role.users)
    @JoinColumn({ name: UserSchema.COLUMNS.ROLE_ID })
    role: RoleEntity;

    @OneToMany(() => MessageEntity, message => message.sender)
    messageSenders: MessageEntity[];

    @OneToMany(() => MessageEntity, message => message.receiver)
    messageReceivers: MessageEntity[];
}
