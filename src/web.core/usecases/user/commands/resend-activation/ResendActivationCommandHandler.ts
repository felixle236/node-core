import * as crypto from 'crypto';
import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { ResendActivationCommand } from './ResendActivationCommand';
import { addSeconds } from '../../../../../libs/date';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { User } from '../../../../domain/entities/user/User';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { IMailService } from '../../../../gateways/services/IMailService';

@Service()
export class ResendActivationCommandHandler implements ICommandHandler<ResendActivationCommand, boolean> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async handle(param: ResendActivationCommand): Promise<boolean> {
        if (!param.email)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'email');

        if (!validator.isEmail(param.email))
            throw new SystemError(MessageError.PARAM_INVALID, 'email');

        const user = await this._userRepository.getByEmail(param.email);
        if (!user || user.status === UserStatus.ACTIVE)
            throw new SystemError(MessageError.DATA_INVALID);

        const data = new User();
        data.activeKey = crypto.randomBytes(32).toString('hex');
        data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);

        const hasSucceed = await this._userRepository.update(user.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        const name = `${user.firstName} ${user.lastName}`;
        this._mailService.resendUserActivation(name, user.email, data.activeKey);
        return hasSucceed;
    }
}
