import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseDbEntity } from './base/BaseDBEntity';
import { DateTransformer } from '../transformers/DateTransformer';
import { GenderType } from '../../../../web.core/domain/enums/GenderType';
import { IUser } from '../../../../web.core/domain/types/IUser';
import { RoleDb } from './RoleDb';
import { RoleId } from '../../../../web.core/domain/enums/RoleId';
import { USER_SCHEMA } from '../schemas/UserSchema';
import { User } from '../../../../web.core/domain/entities/User';
import { UserStatus } from '../../../../web.core/domain/enums/UserStatus';

@Entity(USER_SCHEMA.TABLE_NAME)
export class UserDb extends BaseDbEntity<User> implements IUser {
    @PrimaryGeneratedColumn('uuid', { name: USER_SCHEMA.COLUMNS.ID })
    id: string;

    @Column({ name: USER_SCHEMA.COLUMNS.ROLE_ID })
    roleId: RoleId;

    @Column('enum', { name: USER_SCHEMA.COLUMNS.STATUS, enum: UserStatus, default: UserStatus.ACTIVED })
    status: UserStatus;

    @Column({ name: USER_SCHEMA.COLUMNS.FIRST_NAME, length: 20 })
    firstName: string;

    @Column({ name: USER_SCHEMA.COLUMNS.LAST_NAME, length: 20, nullable: true })
    lastName?: string;

    @Column({ name: USER_SCHEMA.COLUMNS.EMAIL, length: 120 })
    @Index({ unique: true, where: UserDb.getIndexFilterDeletedColumn() })
    email: string;

    @Column({ name: USER_SCHEMA.COLUMNS.PASSWORD, length: 32 })
    password: string;

    @Column({ name: USER_SCHEMA.COLUMNS.AVATAR, length: 200, nullable: true })
    avatar?: string;

    @Column('enum', { name: USER_SCHEMA.COLUMNS.GENDER, enum: GenderType, nullable: true })
    gender?: GenderType;

    @Column('date', { name: USER_SCHEMA.COLUMNS.BIRTHDAY, nullable: true, transformer: new DateTransformer() })
    birthday?: Date;

    @Column({ name: USER_SCHEMA.COLUMNS.PHONE, length: 20, nullable: true })
    phone?: string;

    @Column({ name: USER_SCHEMA.COLUMNS.ADDRESS, length: 200, nullable: true })
    address?: string;

    @Column({ name: USER_SCHEMA.COLUMNS.CULTURE, length: 5, nullable: true })
    culture?: string;

    @Column({ name: USER_SCHEMA.COLUMNS.CURRENCY, length: 3, nullable: true })
    currency?: string;

    @Column({ name: USER_SCHEMA.COLUMNS.ACTIVE_KEY, length: 64, nullable: true })
    activeKey?: string;

    @Column('timestamptz', { name: USER_SCHEMA.COLUMNS.ACTIVE_EXPIRE, nullable: true })
    activeExpire?: Date;

    @Column('timestamptz', { name: USER_SCHEMA.COLUMNS.ACTIVED_AT, nullable: true })
    activedAt?: Date;

    @Column('timestamptz', { name: USER_SCHEMA.COLUMNS.ARCHIVED_AT, nullable: true })
    archivedAt?: Date;

    @Column({ name: USER_SCHEMA.COLUMNS.FORGOT_KEY, length: 64, nullable: true })
    forgotKey?: string;

    @Column('timestamptz', { name: USER_SCHEMA.COLUMNS.FORGOT_EXPIRE, nullable: true })
    forgotExpire?: Date;

    /* Relationship */

    @ManyToOne(() => RoleDb, role => role.users)
    @JoinColumn({ name: USER_SCHEMA.COLUMNS.ROLE_ID })
    role: RoleDb;

    /* handlers */

    toEntity(): User {
        return new User(this);
    }

    fromEntity(entity: User): this {
        const data = entity.toData();

        if (data.id !== undefined)
            this.id = data.id;

        if (data.roleId !== undefined)
            this.roleId = data.roleId;

        if (data.status !== undefined)
            this.status = data.status;

        if (data.firstName !== undefined)
            this.firstName = data.firstName;

        if (data.lastName !== undefined)
            this.lastName = data.lastName;

        if (data.email !== undefined)
            this.email = data.email;

        if (data.password !== undefined)
            this.password = data.password;

        if (data.avatar !== undefined)
            this.avatar = data.avatar;

        if (data.gender !== undefined)
            this.gender = data.gender;

        if (data.birthday !== undefined)
            this.birthday = data.birthday;

        if (data.phone !== undefined)
            this.phone = data.phone;

        if (data.address !== undefined)
            this.address = data.address;

        if (data.culture !== undefined)
            this.culture = data.culture;

        if (data.currency !== undefined)
            this.currency = data.currency;

        if (data.activeKey !== undefined)
            this.activeKey = data.activeKey;

        if (data.activeExpire !== undefined)
            this.activeExpire = data.activeExpire;

        if (data.activedAt !== undefined)
            this.activedAt = data.activedAt;

        if (data.archivedAt !== undefined)
            this.archivedAt = data.archivedAt;

        if (data.forgotKey !== undefined)
            this.forgotKey = data.forgotKey;

        if (data.forgotExpire !== undefined)
            this.forgotExpire = data.forgotExpire;

        return this;
    }
}
