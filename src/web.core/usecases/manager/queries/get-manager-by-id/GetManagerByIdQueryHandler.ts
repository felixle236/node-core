import { Inject, Service } from 'typedi';
import { GetManagerByIdQuery } from './GetManagerByIdQuery';
import { GetManagerByIdQueryResult } from './GetManagerByIdQueryResult';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { IManagerRepository } from '../../../../gateways/repositories/manager/IManagerRepository';

@Service()
export class GetManagerByIdQueryHandler implements IQueryHandler<GetManagerByIdQuery, GetManagerByIdQueryResult> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(param: GetManagerByIdQuery): Promise<GetManagerByIdQueryResult> {
        if (param.roleAuthId !== RoleId.SUPER_ADMIN)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const manager = await this._managerRepository.getById(param.id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return new GetManagerByIdQueryResult(manager);
    }
}
