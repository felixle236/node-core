import { Inject, Service } from 'typedi';
import { FindManagerQuery } from './FindManagerQuery';
import { FindManagerQueryResult } from './FindManagerQueryResult';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { PaginationResult } from '../../../../domain/common/usecase/PaginationResult';
import { FindManagerFilter, IManagerRepository } from '../../../../gateways/repositories/manager/IManagerRepository';

@Service()
export class FindManagerQueryHandler implements IQueryHandler<FindManagerQuery, PaginationResult<FindManagerQueryResult>> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(param: FindManagerQuery): Promise<PaginationResult<FindManagerQueryResult>> {
        if (!param.roleAuthId)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const filter = new FindManagerFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;
        filter.status = param.status;

        const [managers, count] = await this._managerRepository.findAndCount(filter);
        const list = managers.map(manager => new FindManagerQueryResult(manager));

        return new PaginationResult(list, count, param.skip, param.limit);
    }
}
