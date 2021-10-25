import { FindManagerFilter, IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { FindManagerInput } from './FindManagerInput';
import { FindManagerData, FindManagerOutput } from './FindManagerOutput';

@Service()
export class FindManagerHandler extends UsecaseHandler<FindManagerInput, FindManagerOutput> {
    constructor(
        @Inject('manager.repository') private readonly _managerRepository: IManagerRepository
    ) {
        super();
    }

    async handle(param: FindManagerInput): Promise<FindManagerOutput> {
        const filter = new FindManagerFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;
        filter.status = param.status;

        const [managers, count] = await this._managerRepository.findAndCount(filter);
        const result = new FindManagerOutput();
        result.setPagination(count, param.skip, param.limit);
        result.data = managers.map(manager => {
            const data = new FindManagerData();
            data.id = manager.id;
            data.createdAt = manager.createdAt;
            data.firstName = manager.firstName;
            if (manager.lastName)
                data.lastName = manager.lastName;

            data.email = manager.email;
            if (manager.avatar)
                data.avatar = manager.avatar;

            return data;
        });
        return result;
    }
}
