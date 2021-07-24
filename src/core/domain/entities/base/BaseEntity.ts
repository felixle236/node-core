import { IEntity } from '@domain/interfaces/base/IEntity';

export abstract class BaseEntity<TIdentityType, TEntity extends IEntity<TIdentityType>> implements IEntity<TIdentityType> {
    constructor(protected readonly data = {} as TEntity) { }

    get id(): TIdentityType {
        return this.data.id;
    }

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
