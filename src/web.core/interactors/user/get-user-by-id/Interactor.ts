import { Inject, Service } from 'typedi';
import { GetUserByIdOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../domain/common/exceptions/SystemError';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class GetUserByIdInteractor implements IInteractor<string, GetUserByIdOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(id: string, userAuth: UserAuthenticated): Promise<GetUserByIdOutput> {
        const user = await this._userRepository.getById(id);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        if (userAuth && (!user.role || user.role.level <= userAuth.role.level))
            throw new SystemError(MessageError.ACCESS_DENIED);

        return new GetUserByIdOutput(user);
    }
}
