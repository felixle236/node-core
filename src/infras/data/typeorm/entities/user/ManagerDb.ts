import { MANAGER_SCHEMA } from '@data/typeorm/schemas/user/ManagerSchema';
import { Manager } from '@domain/entities/user/Manager';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { IManager } from '@domain/interfaces/user/IManager';
import { Column, Entity, Index } from 'typeorm';
import { UserDb } from './UserDb';

@Entity(MANAGER_SCHEMA.TABLE_NAME)
export class ManagerDb extends UserDb implements IManager {
    @Column('varchar', { name: MANAGER_SCHEMA.COLUMNS.EMAIL, length: 200 })
    @Index({ unique: true, where: ManagerDb.getIndexFilterDeletedColumn() })
    email: string;

    @Column('enum', { name: MANAGER_SCHEMA.COLUMNS.STATUS, enum: ManagerStatus, default: ManagerStatus.ACTIVED })
    status: ManagerStatus;

    @Column('timestamptz', { name: MANAGER_SCHEMA.COLUMNS.ARCHIVED_AT, nullable: true })
    archivedAt: Date | null;

    /* Relationship */

    /* Handlers */

    override toEntity(): Manager {
        return new Manager(this);
    }

    override fromEntity(entity: Manager): IManager {
        return entity.toData();
    }
}
