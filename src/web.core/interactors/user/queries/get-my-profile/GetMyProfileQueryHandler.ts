import { Inject, Service } from 'typedi';
import { GetMyProfileQuery } from './GetMyProfileQuery';
import { GetMyProfileResult } from './GetMyProfileResult';
import { IQueryHandler } from '../../../../domain/common/interactor/interfaces/IQueryHandler';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class GetMyProfileQueryHandler implements IQueryHandler<GetMyProfileQuery, GetMyProfileResult> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: GetMyProfileQuery): Promise<GetMyProfileResult> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const user = await this._userRepository.getById(param.id);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return new GetMyProfileResult(user);
    }
}
