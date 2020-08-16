import * as crypto from 'crypto';
import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { BooleanResult } from '../../../domain/common/outputs/BooleanResult';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IMailService } from '../../../gateways/services/IMailService';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { SystemError } from '../../../domain/common/exceptions';
import { User } from '../../../domain/entities/User';
import { UserStatus } from '../../../domain/enums/UserStatus';
import { addSeconds } from '../../../../libs/date';

@Service()
export class ResendActivationInteractor implements IInteractor<string, BooleanResult> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async handle(email: string): Promise<BooleanResult> {
        if (!validator.isEmail(email))
            throw new SystemError(MessageError.PARAM_INVALID, 'email');

        const user = await this._userRepository.getByEmail(email);
        if (!user || user.status === UserStatus.ACTIVED)
            throw new SystemError();

        const data = new User();
        data.activeKey = crypto.randomBytes(32).toString('hex');
        data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);

        const hasSucceed = await this._userRepository.update(user.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._mailService.resendUserActivation(user);
        return new BooleanResult(hasSucceed);
    }
}
