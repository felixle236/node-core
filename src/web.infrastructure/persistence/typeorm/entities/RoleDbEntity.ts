import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IDbEntity } from '../IDbEntity';
import { IRole } from '../../../../web.core/domain/types/IRole';
import { Role } from '../../../../web.core/domain/entities/Role';
import { RoleSchema } from '../schemas/RoleSchema';
import { UserDbEntity } from './UserDbEntity';

@Entity(RoleSchema.TABLE_NAME)
@Index((role: RoleDbEntity) => [role.name, role.deletedAt], { unique: true })
export class RoleDbEntity implements IRole, IDbEntity<Role> {
    @PrimaryGeneratedColumn({ name: RoleSchema.COLUMNS.ID })
    id: number;

    @CreateDateColumn({ name: RoleSchema.COLUMNS.CREATED_AT, type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: RoleSchema.COLUMNS.UPDATED_AT, type: 'timestamptz' })
    updatedAt: Date;

    @DeleteDateColumn({ name: RoleSchema.COLUMNS.DELETED_AT, type: 'timestamptz', nullable: true })
    deletedAt?: Date;

    @Column({ name: RoleSchema.COLUMNS.NAME, length: 50 })
    name: string;

    @Column('smallint', { name: RoleSchema.COLUMNS.LEVEL })
    level: number;

    /* Relationship */

    @OneToMany(() => UserDbEntity, user => user.role)
    users: UserDbEntity[];

    /* handlers */

    toEntity(): Role {
        return new Role(this);
    }

    fromEntity(entity?: Role): this | undefined {
        if (!entity)
            return;

        if (entity.id !== undefined)
            this.id = entity.id;

        if (entity.name !== undefined)
            this.name = entity.name;

        if (entity.level !== undefined)
            this.level = entity.level;

        return this;
    }
}
