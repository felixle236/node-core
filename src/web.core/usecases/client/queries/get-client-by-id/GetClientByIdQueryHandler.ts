import { Inject, Service } from 'typedi';
import { GetClientByIdQuery } from './GetClientByIdQuery';
import { GetClientByIdQueryResult } from './GetClientByIdQueryResult';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { IClientRepository } from '../../../../gateways/repositories/client/IClientRepository';

@Service()
export class GetClientByIdQueryHandler implements IQueryHandler<GetClientByIdQuery, GetClientByIdQueryResult> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(param: GetClientByIdQuery): Promise<GetClientByIdQueryResult> {
        if (![RoleId.SUPER_ADMIN, RoleId.MANAGER].includes(param.roleAuthId))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const client = await this._clientRepository.getById(param.id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return new GetClientByIdQueryResult(client);
    }
}
