import { Inject, Service } from 'typedi';
import { BooleanResult } from '../../../domain/common/outputs/BooleanResult';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../domain/common/exceptions/SystemError';
import { User } from '../../../domain/entities/User';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';
import { UserStatus } from '../../../domain/enums/UserStatus';

@Service()
export class ArchiveUserInteractor implements IInteractor<string, BooleanResult> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(id: string, userAuth: UserAuthenticated): Promise<BooleanResult> {
        const user = await this._userRepository.getById(id);
        if (!user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'user');

        if (!user.role || user.role.level <= userAuth.role.level)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const data = new User();
        data.status = UserStatus.ARCHIVED;
        data.archivedAt = new Date();

        const hasSucceed = await this._userRepository.update(id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return new BooleanResult(hasSucceed);
    }
}
