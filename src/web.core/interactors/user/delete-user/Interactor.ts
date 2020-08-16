import { Inject, Service } from 'typedi';
import { BooleanResult } from '../../../domain/common/outputs/BooleanResult';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../domain/common/exceptions/SystemError';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class DeleteUserInteractor implements IInteractor<number, BooleanResult> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(id: number, userAuth: UserAuthenticated): Promise<BooleanResult> {
        const user = await this._userRepository.getById(id);
        if (!user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'user');

        if (!user.role || user.role.level <= userAuth.role.level)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const hasSucceed = await this._userRepository.delete(id);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return new BooleanResult(hasSucceed);
    }
}
