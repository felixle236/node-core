import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../../../../web.core/domain/entities/role/Role';
import { IRole } from '../../../../../web.core/domain/types/role/IRole';
import { IUser } from '../../../../../web.core/domain/types/user/IUser';
import { ROLE_SCHEMA } from '../../schemas/role/RoleSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';
import { UserDb } from '../user/UserDb';

@Entity(ROLE_SCHEMA.TABLE_NAME)
export class RoleDb extends BaseDbEntity<Role> implements IRole {
    @PrimaryGeneratedColumn('uuid', { name: ROLE_SCHEMA.COLUMNS.ID })
    id: string;

    @Column('varchar', { name: ROLE_SCHEMA.COLUMNS.NAME, length: 50 })
    @Index({ unique: true, where: BaseDbEntity.getIndexFilterDeletedColumn() })
    name: string;

    /* Relationship */

    @OneToMany(() => UserDb, user => user.role)
    users: IUser[] | null;

    /* Handlers */

    toEntity(): Role {
        return new Role(this);
    }

    fromEntity(entity: Role) {
        return entity.toData();
    }
}
