import { Inject, Service } from 'typedi';
import { BooleanResult } from '../../../domain/common/outputs/BooleanResult';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { SystemError } from '../../../domain/common/exceptions';
import { User } from '../../../domain/entities/User';
import { UserStatus } from '../../../domain/enums/UserStatus';

@Service()
export class ActiveUserInteractor implements IInteractor<string, BooleanResult> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(activeKey: string): Promise<BooleanResult> {
        if (!activeKey)
            throw new SystemError();

        const user = await this._userRepository.getByActiveKey(activeKey);
        if (!user)
            throw new SystemError(1004, 'activation key');
        if (user.status === UserStatus.ACTIVED)
            throw new SystemError();
        if (!user.activeKey || !user.activeExpire || user.activeExpire < new Date())
            throw new SystemError(1008, 'activation key');

        const data = new User();
        data.status = UserStatus.ACTIVED;
        data.activeKey = undefined;
        data.activeExpire = undefined;
        data.activedAt = new Date();

        const hasSucceed = await this._userRepository.update(user.id, data);
        if (!hasSucceed)
            throw new SystemError(5);

        return new BooleanResult(hasSucceed);
    }
}
