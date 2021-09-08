import { CLIENT_SCHEMA } from '@data/typeorm/schemas/user/ClientSchema';
import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IClient } from '@domain/interfaces/user/IClient';
import { Column, Entity, Index } from 'typeorm';
import { UserDb } from './UserDb';

@Entity(CLIENT_SCHEMA.TABLE_NAME)
export class ClientDb extends UserDb implements IClient {
    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.EMAIL, length: 120 })
    @Index({ unique: true, where: ClientDb.getIndexFilterDeletedColumn() })
    email: string;

    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.PHONE, length: 20, nullable: true })
    phone: string | null;

    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.ADDRESS, length: 200, nullable: true })
    address: string | null;

    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.LOCALE, length: 5, nullable: true })
    locale: string | null;

    @Column('enum', { name: CLIENT_SCHEMA.COLUMNS.STATUS, enum: ClientStatus, default: ClientStatus.Actived })
    status: ClientStatus;

    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.ACTIVE_KEY, length: 64, nullable: true })
    activeKey: string | null;

    @Column('timestamptz', { name: CLIENT_SCHEMA.COLUMNS.ACTIVE_EXPIRE, nullable: true })
    activeExpire: Date | null;

    @Column('timestamptz', { name: CLIENT_SCHEMA.COLUMNS.ACTIVED_AT, nullable: true })
    activedAt: Date | null;

    @Column('timestamptz', { name: CLIENT_SCHEMA.COLUMNS.ARCHIVED_AT, nullable: true })
    archivedAt: Date | null;

    /* Relationship */

    /* Handlers */

    override toEntity(): Client {
        return new Client(this);
    }

    override fromEntity(entity: Client): IClient {
        return entity.toData();
    }
}
