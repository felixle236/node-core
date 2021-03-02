import { Inject, Service } from 'typedi';
import { GetMyProfileManagerQuery } from './GetMyProfileManagerQuery';
import { GetMyProfileManagerQueryResult } from './GetMyProfileManagerQueryResult';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { IManagerRepository } from '../../../../gateways/repositories/manager/IManagerRepository';

@Service()
export class GetMyProfileManagerQueryHandler implements IQueryHandler<GetMyProfileManagerQuery, GetMyProfileManagerQueryResult> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(param: GetMyProfileManagerQuery): Promise<GetMyProfileManagerQueryResult> {
        if (!param.userAuthId)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const manager = await this._managerRepository.getById(param.userAuthId);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return new GetMyProfileManagerQueryResult(manager);
    }
}
