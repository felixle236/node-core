import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DateTransformer } from '../transformers/DateTransformer';
import { GenderType } from '../../../../web.core/domain/enums/GenderType';
import { IDbEntity } from '../IDbEntity';
import { IUser } from '../../../../web.core/domain/types/IUser';
import { MessageDbEntity } from './MessageDbEntity';
import { RoleDbEntity } from './RoleDbEntity';
import { User } from '../../../../web.core/domain/entities/User';
import { UserSchema } from '../schemas/UserSchema';
import { UserStatus } from '../../../../web.core/domain/enums/UserStatus';

@Entity(UserSchema.TABLE_NAME)
@Index((user: UserDbEntity) => [user.email, user.deletedAt], { unique: true })
export class UserDbEntity implements IUser, IDbEntity<User> {
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

    @Column('enum', { name: UserSchema.COLUMNS.STATUS, enum: UserStatus, default: UserStatus.INACTIVE })
    status: UserStatus;

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

    @Column('enum', { name: UserSchema.COLUMNS.GENDER, enum: GenderType, nullable: true })
    gender?: GenderType;

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

    @Column('timestamptz', { name: UserSchema.COLUMNS.ARCHIVED_AT, nullable: true })
    archivedAt?: Date;

    @Index({ unique: true })
    @Column({ name: UserSchema.COLUMNS.FORGOT_KEY, length: 64, nullable: true })
    forgotKey?: string;

    @Column('timestamptz', { name: UserSchema.COLUMNS.FORGOT_EXPIRE, nullable: true })
    forgotExpire?: Date;

    /* Relationship */

    @ManyToOne(() => RoleDbEntity, role => role.users)
    @JoinColumn({ name: UserSchema.COLUMNS.ROLE_ID })
    role: RoleDbEntity;

    @OneToMany(() => MessageDbEntity, message => message.sender)
    messageSenders: MessageDbEntity[];

    @OneToMany(() => MessageDbEntity, message => message.receiver)
    messageReceivers: MessageDbEntity[];

    /* handlers */

    toEntity(): User {
        return new User(this);
    }

    fromEntity(entity?: User): this | undefined {
        if (!entity)
            return;

        if (entity.id !== undefined)
            this.id = entity.id;

        if (entity.roleId !== undefined)
            this.roleId = entity.roleId;

        if (entity.status !== undefined)
            this.status = entity.status;

        if (entity.firstName !== undefined)
            this.firstName = entity.firstName;

        if (entity.lastName !== undefined)
            this.lastName = entity.lastName;

        if (entity.email !== undefined)
            this.email = entity.email;

        if (entity.password !== undefined)
            this.password = entity.password;

        if (entity.avatar !== undefined)
            this.avatar = entity.avatar;

        if (entity.gender !== undefined)
            this.gender = entity.gender;

        if (entity.birthday !== undefined)
            this.birthday = entity.birthday;

        if (entity.phone !== undefined)
            this.phone = entity.phone;

        if (entity.address !== undefined)
            this.address = entity.address;

        if (entity.culture !== undefined)
            this.culture = entity.culture;

        if (entity.currency !== undefined)
            this.currency = entity.currency;

        if (entity.activeKey !== undefined)
            this.activeKey = entity.activeKey;

        if (entity.activeExpire !== undefined)
            this.activeExpire = entity.activeExpire;

        if (entity.activedAt !== undefined)
            this.activedAt = entity.activedAt;

        if (entity.archivedAt !== undefined)
            this.archivedAt = entity.archivedAt;

        if (entity.forgotKey !== undefined)
            this.forgotKey = entity.forgotKey;

        if (entity.forgotExpire !== undefined)
            this.forgotExpire = entity.forgotExpire;

        return this;
    }
}
