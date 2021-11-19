import { User } from 'domain/entities/user/User';
import { GenderType } from 'domain/enums/user/GenderType';
import { AddressInfo } from 'domain/value-objects/AddressInfo';
import { Column, Entity, Index } from 'typeorm';
import { DbEntity } from '../../common/DbEntity';
import { USER_SCHEMA } from '../../schemas/user/UserSchema';
import { AuthDb } from '../auth/AuthDb';

export abstract class UserBaseDb<TEntity extends User> extends DbEntity<TEntity> {
    constructor(userType: { new(): TEntity } = User as any) {
        super(userType);
    }

    @Column('uuid', { name: USER_SCHEMA.COLUMNS.ROLE_ID })
    @Index()
    roleId: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.FIRST_NAME })
    firstName: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.LAST_NAME, nullable: true })
    lastName?: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.AVATAR, nullable: true })
    avatar?: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.GENDER, nullable: true })
    gender?: GenderType;

    @Column('date', { name: USER_SCHEMA.COLUMNS.BIRTHDAY, nullable: true })
    birthday?: string;

    @Column('json', { name: USER_SCHEMA.COLUMNS.ADDRESS, nullable: true })
    address?: AddressInfo;

    /* Relationship */

    auths?: AuthDb[];

    /* Handlers */

    override toEntity(): TEntity {
        const entity = super.toEntity();

        entity.roleId = this.roleId;
        entity.firstName = this.firstName;
        entity.lastName = this.lastName;
        entity.avatar = this.avatar;
        entity.gender = this.gender;
        entity.birthday = this.birthday;
        entity.address = this.address;

        /* Relationship */

        if (this.auths)
            entity.auths = this.auths.map(auth => auth.toEntity());

        return entity;
    }

    override fromEntity(entity: TEntity): void {
        super.fromEntity(entity);

        this.roleId = entity.roleId;
        this.firstName = entity.firstName;
        this.lastName = entity.lastName;
        this.avatar = entity.avatar;
        this.gender = entity.gender;
        this.birthday = entity.birthday;
        this.address = entity.address;
    }
}

@Entity(USER_SCHEMA.TABLE_NAME)
export class UserDb extends UserBaseDb<User> {

}
