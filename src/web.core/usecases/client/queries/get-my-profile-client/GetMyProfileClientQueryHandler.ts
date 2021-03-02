import { Inject, Service } from 'typedi';
import { GetMyProfileClientQuery } from './GetMyProfileClientQuery';
import { GetMyProfileClientQueryResult } from './GetMyProfileClientQueryResult';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { IClientRepository } from '../../../../gateways/repositories/client/IClientRepository';

@Service()
export class GetMyProfileClientQueryHandler implements IQueryHandler<GetMyProfileClientQuery, GetMyProfileClientQueryResult> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(param: GetMyProfileClientQuery): Promise<GetMyProfileClientQueryResult> {
        if (!param.userAuthId)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const client = await this._clientRepository.getById(param.userAuthId);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return new GetMyProfileClientQueryResult(client);
    }
}
