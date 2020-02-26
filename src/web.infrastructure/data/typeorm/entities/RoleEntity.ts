import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IRole } from '../../../../web.core/interfaces/models/IRole';
import { PermissionEntity } from './PermissionEntity';
import { RoleSchema } from '../schemas/RoleSchema';
import { UserEntity } from './UserEntity';

@Entity(RoleSchema.TABLE_NAME)
@Index((role: RoleEntity) => [role.name, role.deletedAt], { unique: true })
export class RoleEntity implements IRole {
    @PrimaryGeneratedColumn({ name: RoleSchema.COLUMNS.ID })
    id: number;

    @CreateDateColumn({ name: RoleSchema.COLUMNS.CREATED_AT, type: 'timestamptz', update: false })
    createdAt: Date;

    @UpdateDateColumn({ name: RoleSchema.COLUMNS.UPDATED_AT, type: 'timestamptz', update: false })
    updatedAt: Date;

    @Column('timestamptz', { name: RoleSchema.COLUMNS.DELETED_AT, nullable: true })
    deletedAt?: Date;

    @Column({ name: RoleSchema.COLUMNS.NAME, length: 50 })
    name: string;

    @Column('smallint', { name: RoleSchema.COLUMNS.LEVEL })
    level: number;

    /* Relationship */

    @OneToMany(() => UserEntity, user => user.role)
    users: UserEntity[];

    @OneToMany(() => PermissionEntity, permission => permission.role)
    permissions: PermissionEntity[];
}
