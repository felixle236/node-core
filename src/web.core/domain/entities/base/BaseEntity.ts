import { IEntity } from '../../types/base/IEntity';

export abstract class BaseEntity<TEntity extends IEntity> implements IEntity {
    constructor(protected readonly data = {} as TEntity) { }

    get createdAt(): Date {
        return this.data.createdAt;
    }

    get updatedAt(): Date {
        return this.data.updatedAt;
    }

    get deletedAt(): Date | null {
        return this.data.deletedAt;
    }

    /* Handlers */

    toData(): TEntity {
        return this.data;
    }
}
