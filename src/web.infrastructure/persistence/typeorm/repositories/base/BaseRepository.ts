import { Repository, getRepository } from 'typeorm';
import { DbContext } from '../../DbContext';
import { IFilter } from '../../../../../web.core/domain/common/inputs/IFilter';
import { IRead } from '../../../../../web.core/domain/common/persistence/IRead';
import { IWrite } from '../../../../../web.core/domain/common/persistence/IWrite';

export class BaseRepository<TEntity, TDbEntity, TIdentityType> implements IRead<TEntity, TIdentityType>, IWrite<TEntity, TIdentityType> {
    protected readonly dbContext: DbContext;
    protected readonly repository: Repository<TDbEntity>;

    constructor(_type: { new(): TDbEntity }) {
        this.dbContext = new DbContext();
        this.repository = getRepository(_type);
    }

    async find(_filter: IFilter): Promise<[TEntity[], number]> {
        throw new Error();
    }

    async getById(_id: TIdentityType): Promise<TEntity | undefined> {
        throw new Error();
    }

    async create(_data: TEntity): Promise<TIdentityType | undefined> {
        throw new Error();
    }

    async update(_id: TIdentityType, _data: TEntity): Promise<boolean> {
        throw new Error();
    }

    async delete(_id: TIdentityType): Promise<boolean> {
        throw new Error();
    }
}
