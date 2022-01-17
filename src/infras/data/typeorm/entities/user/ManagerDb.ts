import { Manager } from 'domain/entities/user/Manager';
import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { Column, Entity, Index } from 'typeorm';
import { UserBaseDb } from './UserDb';
import { MANAGER_SCHEMA } from '../../schemas/user/ManagerSchema';

@Entity(MANAGER_SCHEMA.TABLE_NAME)
export class ManagerDb extends UserBaseDb<Manager> {
  constructor() {
    super(Manager);
  }

  @Column('varchar', { name: MANAGER_SCHEMA.COLUMNS.EMAIL })
  @Index({ unique: true, where: UserBaseDb.getIndexFilterDeletedColumn() })
  email: string;

  @Column('enum', { name: MANAGER_SCHEMA.COLUMNS.STATUS, enum: ManagerStatus, default: ManagerStatus.Actived })
  status: ManagerStatus;

  @Column('timestamptz', { name: MANAGER_SCHEMA.COLUMNS.ARCHIVED_AT, nullable: true })
  archivedAt?: Date;

  /* Relationship */

  /* Handlers */

  override toEntity(): Manager {
    const entity = super.toEntity();

    entity.email = this.email;
    entity.status = this.status;
    entity.archivedAt = this.archivedAt;

    return entity;
  }

  override fromEntity(entity: Manager): void {
    super.fromEntity(entity);

    this.email = entity.email;
    this.status = entity.status;
    this.archivedAt = entity.archivedAt;
  }
}
