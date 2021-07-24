import { User } from '@domain/entities/user/User';
import { GenderType } from '@domain/enums/user/GenderType';
import { IAuth } from '@domain/interfaces/auth/IAuth';
import { IUser } from '@domain/interfaces/user/IUser';
import { Column, Entity, Index } from 'typeorm';
import { USER_SCHEMA } from '../../schemas/user/UserSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';

@Entity(USER_SCHEMA.TABLE_NAME)
export class UserDb extends BaseDbEntity<string, User> implements IUser {
    @Column('uuid', { name: USER_SCHEMA.COLUMNS.ROLE_ID })
    @Index()
    roleId: string;

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

    auths: IAuth[] | null;

    /* Handlers */

    toEntity(): User {
        return new User(this);
    }

    fromEntity(entity: User): IUser {
        return entity.toData();
    }
}
