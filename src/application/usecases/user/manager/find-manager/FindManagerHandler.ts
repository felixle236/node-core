import { RoleId } from 'domain/enums/user/RoleId';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { FindManagerInput } from './FindManagerInput';
import { FindManagerData, FindManagerOutput } from './FindManagerOutput';

@Service()
export class FindManagerHandler implements IUsecaseHandler<FindManagerInput, FindManagerOutput> {
    constructor(
        @Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository
    ) {}

    async handle(param: FindManagerInput): Promise<FindManagerOutput> {
        const [managers, count] = await this._managerRepository.findAndCount({
            roleIds: [RoleId.Manager],
            keyword: param.keyword,
            status: param.status,
            skip: param.skip,
            limit: param.limit
        });

        const result = new FindManagerOutput();
        result.setPagination(count, param.skip, param.limit);
        result.data = managers.map(manager => {
            const data = new FindManagerData();
            data.id = manager.id;
            data.createdAt = manager.createdAt;
            data.firstName = manager.firstName;
            data.lastName = manager.lastName;
            data.email = manager.email;
            data.avatar = manager.avatar;

            return data;
        });
        return result;
    }
}
