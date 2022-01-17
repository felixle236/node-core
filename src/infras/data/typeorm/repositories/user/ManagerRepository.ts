import { Manager } from 'domain/entities/user/Manager';
import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { SelectFilterPaginationQuery, SelectSortQuery } from 'shared/database/DbTypes';
import { InjectRepository } from 'shared/types/Injection';
import { Service } from 'typedi';
import { Brackets } from 'typeorm';
import { Repository } from '../../common/Repository';
import { ManagerDb } from '../../entities/user/ManagerDb';
import { MANAGER_SCHEMA } from '../../schemas/user/ManagerSchema';

@Service(InjectRepository.Manager)
export class ManagerRepository extends Repository<Manager, ManagerDb> implements IManagerRepository {
  constructor() {
    super(ManagerDb, MANAGER_SCHEMA);
  }

  protected override handleSortQuery(query, sorts?: SelectSortQuery<Manager>[]): void {
    if (sorts) {
      sorts.forEach((sort) => {
        let field = '';
        if (sort.field === 'firstName') {
          field = `${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.FIRST_NAME}`;
        } else if (sort.field === 'createdAt') {
          field = `${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.CREATED_AT}`;
        }

        if (field) {
          query.addOrderBy(field, sort.type);
        }
      });
    }
  }

  override async findAndCount(
    filter: { roleIds?: string[]; keyword?: string; status?: ManagerStatus } & SelectFilterPaginationQuery<Manager>,
  ): Promise<[Manager[], number]> {
    const query = this.repository.createQueryBuilder(MANAGER_SCHEMA.TABLE_NAME);
    if (filter.roleIds && filter.roleIds.length) {
      query.andWhere(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.ROLE_ID} IN (:...roleIds)`, { roleIds: filter.roleIds });
    }

    if (filter.status) {
      query.andWhere(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.STATUS} = :status`, { status: filter.status });
    }

    if (filter.keyword) {
      const keyword = `%${filter.keyword}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where(
            `${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.FIRST_NAME} || ' ' || ${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.LAST_NAME} ILIKE :keyword`,
            { keyword },
          ).orWhere(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.EMAIL} ILIKE :keyword`, { keyword });
        }),
      );
    }

    this.handleSortQuery(query, filter.sorts);
    query.skip(filter.skip);
    query.take(filter.limit);

    const [list, count] = await query.getManyAndCount();
    return [list.map((item) => item.toEntity()), count];
  }

  async getByEmail(email: string): Promise<Manager | undefined> {
    const result = await this.repository
      .createQueryBuilder(MANAGER_SCHEMA.TABLE_NAME)
      .where(`LOWER(${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
      .getOne();
    return result && result.toEntity();
  }

  async checkEmailExist(email: string): Promise<boolean> {
    const result = await this.repository
      .createQueryBuilder(MANAGER_SCHEMA.TABLE_NAME)
      .select(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.ID}`)
      .where(`LOWER(${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
      .getOne();
    return !!result;
  }
}
