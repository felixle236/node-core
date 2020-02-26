import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IPermission } from '../../../../web.core/interfaces/models/IPermission';
import { PermissionSchema } from '../schemas/PermissionSchema';
import { RoleEntity } from './RoleEntity';

@Entity(PermissionSchema.TABLE_NAME)
@Index((permission: PermissionEntity) => [permission.role, permission.claim], { unique: true })
export class PermissionEntity implements IPermission {
    @PrimaryGeneratedColumn({ name: PermissionSchema.COLUMNS.ID })
    id: number;

    @Column({ name: PermissionSchema.COLUMNS.ROLE_ID })
    roleId: number;

    @Column({ name: PermissionSchema.COLUMNS.CLAIM })
    claim: number;

    /* Relationship */

    @ManyToOne(() => RoleEntity, role => role.permissions)
    @JoinColumn({ name: PermissionSchema.COLUMNS.ROLE_ID })
    role: RoleEntity;
}
