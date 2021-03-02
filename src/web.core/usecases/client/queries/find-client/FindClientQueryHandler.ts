import { Inject, Service } from 'typedi';
import { FindClientQuery } from './FindClientQuery';
import { FindClientQueryResult } from './FindClientQueryResult';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { PaginationResult } from '../../../../domain/common/usecase/PaginationResult';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { FindClientFilter, IClientRepository } from '../../../../gateways/repositories/client/IClientRepository';

@Service()
export class FindClientQueryHandler implements IQueryHandler<FindClientQuery, PaginationResult<FindClientQueryResult>> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(param: FindClientQuery): Promise<PaginationResult<FindClientQueryResult>> {
        if (![RoleId.SUPER_ADMIN, RoleId.MANAGER].includes(param.roleAuthId))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const filter = new FindClientFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;
        filter.status = param.status;

        const [clients, count] = await this._clientRepository.findAndCount(filter);
        const list = clients.map(client => new FindClientQueryResult(client));

        return new PaginationResult(list, count, param.skip, param.limit);
    }
}
