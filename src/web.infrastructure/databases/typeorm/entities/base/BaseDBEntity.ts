import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { BASE_SCHEMA } from '../../schemas/base/BaseSchema';
import { IEntity } from '../../../../../web.core/domain/types/base/IEntity';

export abstract class BaseDbEntity<T extends IEntity> {
    @CreateDateColumn({ name: BASE_SCHEMA.COLUMNS.CREATED_AT, type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: BASE_SCHEMA.COLUMNS.UPDATED_AT, type: 'timestamptz' })
    updatedAt: Date;

    @DeleteDateColumn({ name: BASE_SCHEMA.COLUMNS.DELETED_AT, type: 'timestamptz', nullable: true })
    deletedAt?: Date;

    /* handlers */

    abstract toEntity(): T;
    abstract fromEntity(entity: T): this;
}
