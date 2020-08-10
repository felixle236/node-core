import { QueryRunner, Repository, getRepository } from 'typeorm';
import { Container } from 'typedi';
import { DbContext } from '../../DbContext';
import { IFilterModel } from '../../../../../web.core/domain/common/inputs/IFilterModel';
import { IRead } from '../interfaces/IRead';
import { IWrite } from '../interfaces/IWrite';

export class BaseRepository<TEntity, TDbEntity> implements IRead<TEntity>, IWrite<TEntity> {
    protected readonly dbContext: DbContext;
    protected readonly repository: Repository<TDbEntity>;

    constructor(_type: { new(): TDbEntity }) {
        this.dbContext = Container.get('database.context');
        this.repository = getRepository(_type);
    }

    async find(_filters: IFilterModel): Promise<[TEntity[], number]> {
        throw new Error();
    }

    async getById(_id: number | string, _queryRunner?: QueryRunner): Promise<TEntity | undefined> {
        throw new Error();
    }

    async create(_data: TEntity, _queryRunner?: QueryRunner): Promise<number | string | undefined> {
        throw new Error();
    }

    async update(_id: number | string, _data: TEntity, _queryRunner?: QueryRunner): Promise<boolean> {
        throw new Error();
    }

    async delete(_id: number | string, _queryRunner?: QueryRunner): Promise<boolean> {
        throw new Error();
    }
}
