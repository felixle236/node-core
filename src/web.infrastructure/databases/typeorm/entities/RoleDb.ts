import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseDbEntity } from './base/BaseDBEntity';
import { IRole } from '../../../../web.core/domain/types/IRole';
import { ROLE_SCHEMA } from '../schemas/RoleSchema';
import { Role } from '../../../../web.core/domain/entities/Role';
import { UserDb } from './UserDb';

@Entity(ROLE_SCHEMA.TABLE_NAME)
@Index((role: RoleDb) => [role.name, role.deletedAt], { unique: true })
export class RoleDb extends BaseDbEntity<Role> implements IRole {
    @PrimaryGeneratedColumn('uuid', { name: ROLE_SCHEMA.COLUMNS.ID })
    id: string;

    @Column({ name: ROLE_SCHEMA.COLUMNS.NAME, length: 50 })
    name: string;

    @Column('smallint', { name: ROLE_SCHEMA.COLUMNS.LEVEL })
    level: number;

    /* Relationship */

    @OneToMany(() => UserDb, user => user.role)
    users: UserDb[];

    /* handlers */

    toEntity(): Role {
        return new Role(this);
    }

    fromEntity(entity: Role): this {
        const data = entity.toData();

        if (data.id !== undefined)
            this.id = data.id;

        if (data.name !== undefined)
            this.name = data.name;

        if (data.level !== undefined)
            this.level = data.level;

        return this;
    }
}
