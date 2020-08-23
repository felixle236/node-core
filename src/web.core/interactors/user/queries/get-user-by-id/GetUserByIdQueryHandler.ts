import { Inject, Service } from 'typedi';
import { GetUserByIdQuery } from './GetUserByIdQuery';
import { GetUserByIdResult } from './GetUserByIdResult';
import { IQueryHandler } from '../../../../domain/common/interactor/interfaces/IQueryHandler';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery, GetUserByIdResult> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: GetUserByIdQuery): Promise<GetUserByIdResult> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (!param.roleAuthLevel)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'role level');

        const user = await this._userRepository.getById(param.id);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        if (!user.role || user.role.level <= param.roleAuthLevel)
            throw new SystemError(MessageError.ACCESS_DENIED);

        return new GetUserByIdResult(user);
    }
}
