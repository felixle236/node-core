import { Entity } from 'domain/common/Entity';
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SCHEMA } from './Schema';

export abstract class DbEntity<TEntity extends Entity> {
    constructor(private _type: { new(): TEntity }) {}

    @PrimaryGeneratedColumn('uuid', { name: SCHEMA.COLUMNS.ID })
    id: string;

    @CreateDateColumn({ name: SCHEMA.COLUMNS.CREATED_AT, type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: SCHEMA.COLUMNS.UPDATED_AT, type: 'timestamptz' })
    updatedAt: Date;

    @DeleteDateColumn({ name: SCHEMA.COLUMNS.DELETED_AT, type: 'timestamptz', nullable: true })
    deletedAt?: Date;

    /* Relationship */

    /* Handlers */

    toEntity(): TEntity {
        const entity = new this._type();
        entity.id = this.id;
        entity.createdAt = this.createdAt;
        entity.updatedAt = this.updatedAt;
        entity.deletedAt = this.deletedAt;
        return entity;
    }

    fromEntity(entity: TEntity): void {
        this.id = entity.id;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
        this.deletedAt = entity.deletedAt;
    }

    static getIndexFilterDeletedColumn(): string {
        return `${SCHEMA.COLUMNS.DELETED_AT} IS NULL`;
    }
}
