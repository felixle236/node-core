import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../../../../../web.core/domain/entities/client/Client';
import { Manager } from '../../../../../web.core/domain/entities/manager/Manager';
import { User } from '../../../../../web.core/domain/entities/user/User';
import { ClientStatus } from '../../../../../web.core/domain/enums/client/ClientStatus';
import { ManagerStatus } from '../../../../../web.core/domain/enums/manager/ManagerStatus';
import { RoleId } from '../../../../../web.core/domain/enums/role/RoleId';
import { GenderType } from '../../../../../web.core/domain/enums/user/GenderType';
import { IAuth } from '../../../../../web.core/domain/types/auth/IAuth';
import { IClient } from '../../../../../web.core/domain/types/client/IClient';
import { IManager } from '../../../../../web.core/domain/types/manager/IManager';
import { IRole } from '../../../../../web.core/domain/types/role/IRole';
import { IUser } from '../../../../../web.core/domain/types/user/IUser';
import { CLIENT_SCHEMA } from '../../schemas/client/ClientSchema';
import { MANAGER_SCHEMA } from '../../schemas/manager/ManagerSchema';
import { USER_SCHEMA } from '../../schemas/user/UserSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';
import { RoleDb } from '../role/RoleDb';

@Entity(USER_SCHEMA.TABLE_NAME)
export class UserDb extends BaseDbEntity<User> implements IUser {
    @PrimaryGeneratedColumn('uuid', { name: USER_SCHEMA.COLUMNS.ID })
    id: string;

    @Column('uuid', { name: USER_SCHEMA.COLUMNS.ROLE_ID })
    roleId: RoleId;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.FIRST_NAME, length: 20 })
    firstName: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.LAST_NAME, length: 20, nullable: true })
    lastName: string | null;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.AVATAR, length: 200, nullable: true })
    avatar: string | null;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.GENDER, length: 6, nullable: true })
    gender: GenderType | null;

    @Column('date', { name: USER_SCHEMA.COLUMNS.BIRTHDAY, nullable: true })
    birthday: string | null;

    /* Relationship */

    @ManyToOne(() => RoleDb, role => role.users)
    @JoinColumn({ name: USER_SCHEMA.COLUMNS.ROLE_ID })
    role: IRole | null;

    auths: IAuth[] | null;

    /* handlers */

    toEntity(): User {
        return new User(this);
    }

    fromEntity(entity: User) {
        return entity.toData();
    }
}

@Entity(MANAGER_SCHEMA.TABLE_NAME)
export class ManagerDb extends UserDb implements IManager {
    @Column('enum', { name: MANAGER_SCHEMA.COLUMNS.STATUS, enum: ManagerStatus })
    status: ManagerStatus;

    @Column('varchar', { name: MANAGER_SCHEMA.COLUMNS.EMAIL, length: 120 })
    @Index({ unique: true, where: BaseDbEntity.getIndexFilterDeletedColumn() })
    email: string;

    @Column('timestamptz', { name: MANAGER_SCHEMA.COLUMNS.ARCHIVED_AT, nullable: true })
    archivedAt: Date | null;

    /* handlers */

    toEntity(): Manager {
        return new Manager(this);
    }

    fromEntity(entity: Manager) {
        return entity.toData();
    }
}

@Entity(CLIENT_SCHEMA.TABLE_NAME)
export class ClientDb extends UserDb implements IClient {
    @Column('enum', { name: CLIENT_SCHEMA.COLUMNS.STATUS, enum: ClientStatus, default: ClientStatus.INACTIVE })
    status: ClientStatus;

    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.EMAIL, length: 120 })
    @Index({ unique: true, where: BaseDbEntity.getIndexFilterDeletedColumn() })
    email: string;

    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.PHONE, length: 20, nullable: true })
    phone: string | null;

    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.ADDRESS, length: 200, nullable: true })
    address: string | null;

    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.CULTURE, length: 5, nullable: true })
    culture: string | null;

    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.CURRENCY, length: 3, nullable: true })
    currency: string | null;

    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.ACTIVE_KEY, length: 64, nullable: true })
    activeKey: string | null;

    @Column('timestamptz', { name: CLIENT_SCHEMA.COLUMNS.ACTIVE_EXPIRE, nullable: true })
    activeExpire: Date | null;

    @Column('timestamptz', { name: CLIENT_SCHEMA.COLUMNS.ACTIVED_AT, nullable: true })
    activedAt: Date | null;

    @Column('timestamptz', { name: CLIENT_SCHEMA.COLUMNS.ARCHIVED_AT, nullable: true })
    archivedAt: Date | null;

    /* handlers */

    toEntity(): Client {
        return new Client(this);
    }

    fromEntity(entity: Client) {
        return entity.toData();
    }
}
