import { Inject, Service } from 'typedi';
import { GetMyProfileQuery } from './GetMyProfileQuery';
import { GetMyProfileQueryResult } from './GetMyProfileQueryResult';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class GetMyProfileQueryHandler implements IQueryHandler<GetMyProfileQuery, GetMyProfileQueryResult> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: GetMyProfileQuery): Promise<GetMyProfileQueryResult> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const user = await this._userRepository.getById(param.id);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return new GetMyProfileQueryResult(user);
    }
}
