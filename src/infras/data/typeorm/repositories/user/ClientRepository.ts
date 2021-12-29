import { Client } from 'domain/entities/user/Client';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { SelectFilterPaginationQuery, SelectSortQuery } from 'shared/database/DbTypes';
import { InjectRepository } from 'shared/types/Injection';
import { Service } from 'typedi';
import { Brackets } from 'typeorm';
import { Repository } from '../../common/Repository';
import { ClientDb } from '../../entities/user/ClientDb';
import { CLIENT_SCHEMA } from '../../schemas/user/ClientSchema';

@Service(InjectRepository.Client)
export class ClientRepository extends Repository<Client, ClientDb> implements IClientRepository {
    constructor() {
        super(ClientDb, CLIENT_SCHEMA);
    }

    protected override handleSortQuery(query, sorts?: SelectSortQuery<Client>[]): void {
        if (sorts) {
            sorts.forEach(sort => {
                let field = '';
                if (sort.field === 'firstName')
                    field = `${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.FIRST_NAME}`;
                else if (sort.field === 'createdAt')
                    field = `${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.CREATED_AT}`;

                if (field)
                    query.addOrderBy(field, sort.type);
            });
        }
    }

    override async findAndCount(filter: { keyword?: string, status?: ClientStatus } & SelectFilterPaginationQuery<Client>): Promise<[Client[], number]> {
        const query = this.repository.createQueryBuilder(CLIENT_SCHEMA.TABLE_NAME);
        if (filter.status)
            query.where(`${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.STATUS} = :status`, { status: filter.status });

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query.andWhere(new Brackets(qb => {
                qb.where(`${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.FIRST_NAME} || ' ' || ${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.LAST_NAME} ILIKE :keyword`, { keyword })
                    .orWhere(`${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.EMAIL} ILIKE :keyword`, { keyword });
            }));
        }

        this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async getByEmail(email: string): Promise<Client | undefined> {
        const result = await this.repository.createQueryBuilder(CLIENT_SCHEMA.TABLE_NAME)
            .where(`LOWER(${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return result && result.toEntity();
    }

    async checkEmailExist(email: string): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(CLIENT_SCHEMA.TABLE_NAME)
            .select(`${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.ID}`)
            .where(`LOWER(${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return !!result;
    }
}
