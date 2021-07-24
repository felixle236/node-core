import { FindManagerFilter, IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindManagerQueryInput } from './FindManagerQueryInput';
import { FindManagerQueryOutput } from './FindManagerQueryOutput';

@Service()
export class FindManagerQueryHandler extends QueryHandler<FindManagerQueryInput, FindManagerQueryOutput> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(param: FindManagerQueryInput): Promise<FindManagerQueryOutput> {
        const filter = new FindManagerFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;
        filter.status = param.status;

        const [managers, count] = await this._managerRepository.findAndCount(filter);
        const result = new FindManagerQueryOutput();
        result.setData(managers);
        result.setPagination(count, param.skip, param.limit);
        return result;
    }
}
