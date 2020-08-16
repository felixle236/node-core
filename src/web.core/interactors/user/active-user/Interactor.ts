import { Inject, Service } from 'typedi';
import { BooleanResult } from '../../../domain/common/outputs/BooleanResult';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../domain/common/exceptions/SystemError';
import { User } from '../../../domain/entities/User';
import { UserStatus } from '../../../domain/enums/UserStatus';

@Service()
export class ActiveUserInteractor implements IInteractor<string, BooleanResult> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(activeKey: string): Promise<BooleanResult> {
        if (!activeKey)
            throw new SystemError(MessageError.DATA_INVALID);

        const user = await this._userRepository.getByActiveKey(activeKey);
        if (!user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'activation key');
        if (user.status === UserStatus.ACTIVED)
            throw new SystemError();
        if (!user.activeKey || !user.activeExpire || user.activeExpire < new Date())
            throw new SystemError(MessageError.PARAM_EXPIRED, 'activation key');

        const data = new User();
        data.status = UserStatus.ACTIVED;
        data.activeKey = undefined;
        data.activeExpire = undefined;
        data.activedAt = new Date();

        const hasSucceed = await this._userRepository.update(user.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return new BooleanResult(hasSucceed);
    }
}
