import { Inject, Service } from 'typedi';
import { GetMyProfileOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../domain/common/exceptions/SystemError';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class GetMyProfileInteractor implements IInteractor<UserAuthenticated, GetMyProfileOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(userAuth: UserAuthenticated): Promise<GetMyProfileOutput> {
        const user = await this._userRepository.getById(userAuth.userId);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return new GetMyProfileOutput(user);
    }
}
