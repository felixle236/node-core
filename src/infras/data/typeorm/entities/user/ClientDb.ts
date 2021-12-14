import { Client } from 'domain/entities/user/Client';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { AddressInfo } from 'domain/value-objects/AddressInfo';
import { Column, Entity, Index } from 'typeorm';
import { UserBaseDb } from './UserDb';
import { CLIENT_SCHEMA } from '../../schemas/user/ClientSchema';

@Entity(CLIENT_SCHEMA.TABLE_NAME)
export class ClientDb extends UserBaseDb<Client> {
    constructor() {
        super(Client);
    }

    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.EMAIL })
    @Index({ unique: true, where: ClientDb.getIndexFilterDeletedColumn() })
    email: string;

    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.PHONE, nullable: true })
    phone?: string;

    @Column('json', { name: CLIENT_SCHEMA.COLUMNS.ADDRESS, nullable: true })
    address?: AddressInfo;

    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.LOCALE, nullable: true })
    locale?: string;

    @Column('enum', { name: CLIENT_SCHEMA.COLUMNS.STATUS, enum: ClientStatus, default: ClientStatus.Actived })
    status: ClientStatus;

    @Column('varchar', { name: CLIENT_SCHEMA.COLUMNS.ACTIVE_KEY, nullable: true })
    activeKey?: string;

    @Column('timestamptz', { name: CLIENT_SCHEMA.COLUMNS.ACTIVE_EXPIRE, nullable: true })
    activeExpire?: Date;

    @Column('timestamptz', { name: CLIENT_SCHEMA.COLUMNS.ACTIVED_AT, nullable: true })
    activedAt?: Date;

    @Column('timestamptz', { name: CLIENT_SCHEMA.COLUMNS.ARCHIVED_AT, nullable: true })
    archivedAt?: Date;

    /* Relationship */

    /* Handlers */

    override toEntity(): Client {
        const entity = super.toEntity();

        entity.email = this.email;
        entity.phone = this.phone;
        entity.address = this.address;
        entity.locale = this.locale;
        entity.status = this.status;
        entity.activeKey = this.activeKey;
        entity.activeExpire = this.activeExpire;
        entity.activedAt = this.activedAt;
        entity.archivedAt = this.archivedAt;

        return entity;
    }

    override fromEntity(entity: Client): void {
        super.fromEntity(entity);

        this.email = entity.email;
        this.phone = entity.phone;
        this.address = entity.address;
        this.locale = entity.locale;
        this.status = entity.status;
        this.activeKey = entity.activeKey;
        this.activeExpire = entity.activeExpire;
        this.activedAt = entity.activedAt;
        this.archivedAt = entity.archivedAt;
    }
}
