import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../../../web.core/domain/entities/user/User';
import { RoleId } from '../../../../../web.core/domain/enums/role/RoleId';
import { GenderType } from '../../../../../web.core/domain/enums/user/GenderType';
import { UserStatus } from '../../../../../web.core/domain/enums/user/UserStatus';
import { IAuth } from '../../../../../web.core/domain/types/auth/IAuth';
import { IRole } from '../../../../../web.core/domain/types/role/IRole';
import { IUser } from '../../../../../web.core/domain/types/user/IUser';
import { USER_SCHEMA } from '../../schemas/user/UserSchema';
import { AuthDb } from '../auth/AuthDb';
import { BaseDbEntity } from '../base/BaseDBEntity';
import { RoleDb } from '../role/RoleDb';

@Entity(USER_SCHEMA.TABLE_NAME)
export class UserDb extends BaseDbEntity<User> implements IUser {
    @PrimaryGeneratedColumn('uuid', { name: USER_SCHEMA.COLUMNS.ID })
    id: string;

    @Column('uuid', { name: USER_SCHEMA.COLUMNS.ROLE_ID })
    roleId: RoleId;

    @Column('enum', { name: USER_SCHEMA.COLUMNS.STATUS, enum: UserStatus, default: UserStatus.ACTIVED })
    status: UserStatus;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.FIRST_NAME, length: 20 })
    firstName: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.LAST_NAME, length: 20, nullable: true })
    lastName: string | null;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.EMAIL, length: 120 })
    @Index({ unique: true, where: UserDb.getIndexFilterDeletedColumn() })
    email: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.AVATAR, length: 200, nullable: true })
    avatar: string | null;

    @Column('enum', { name: USER_SCHEMA.COLUMNS.GENDER, enum: GenderType, nullable: true })
    gender: GenderType | null;

    @Column('date', { name: USER_SCHEMA.COLUMNS.BIRTHDAY, nullable: true })
    birthday: string | null;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.PHONE, length: 20, nullable: true })
    phone: string | null;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.ADDRESS, length: 200, nullable: true })
    address: string | null;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.CULTURE, length: 5, nullable: true })
    culture: string | null;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.CURRENCY, length: 3, nullable: true })
    currency: string | null;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.ACTIVE_KEY, length: 64, nullable: true })
    activeKey: string | null;

    @Column('timestamptz', { name: USER_SCHEMA.COLUMNS.ACTIVE_EXPIRE, nullable: true })
    activeExpire: Date | null;

    @Column('timestamptz', { name: USER_SCHEMA.COLUMNS.ACTIVED_AT, nullable: true })
    activedAt: Date | null;

    @Column('timestamptz', { name: USER_SCHEMA.COLUMNS.ARCHIVED_AT, nullable: true })
    archivedAt: Date | null;

    /* Relationship */

    @ManyToOne(() => RoleDb, role => role.users)
    @JoinColumn({ name: USER_SCHEMA.COLUMNS.ROLE_ID })
    role: IRole | null;

    @OneToMany(() => AuthDb, auth => auth.user)
    auths: IAuth[] | null;

    /* Handlers */

    toEntity(): User {
        return new User(this);
    }

    fromEntity(entity: User) {
        return entity.toData();
    }
}
