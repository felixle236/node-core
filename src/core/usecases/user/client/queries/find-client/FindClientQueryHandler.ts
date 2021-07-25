import { FindClientFilter, IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { validateDataInput } from '@libs/common';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindClientQueryInput } from './FindClientQueryInput';
import { FindClientQueryOutput } from './FindClientQueryOutput';

@Service()
export class FindClientQueryHandler extends QueryHandler<FindClientQueryInput, FindClientQueryOutput> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(param: FindClientQueryInput): Promise<FindClientQueryOutput> {
        await validateDataInput(param);

        const filter = new FindClientFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;
        filter.status = param.status;

        const [clients, count] = await this._clientRepository.findAndCount(filter);

        const result = new FindClientQueryOutput();
        result.setData(clients);
        result.setPagination(count, param.skip, param.limit);
        return result;
    }
}
