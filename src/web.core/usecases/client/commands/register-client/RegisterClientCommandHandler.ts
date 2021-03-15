import * as crypto from 'crypto';
import { Inject, Service } from 'typedi';
import { v4 } from 'uuid';
import { RegisterClientCommand } from './RegisterClientCommand';
import { addSeconds } from '../../../../../libs/date';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Client } from '../../../../domain/entities/client/Client';
import { ClientStatus } from '../../../../domain/enums/client/ClientStatus';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { IClient } from '../../../../domain/types/client/IClient';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '../../../../gateways/repositories/client/IClientRepository';
import { IMailService } from '../../../../gateways/services/IMailService';
import { CreateAuthByEmailCommand } from '../../../auth/commands/create-auth-by-email/CreateAuthByEmailCommand';
import { CreateAuthByEmailCommandHandler } from '../../../auth/commands/create-auth-by-email/CreateAuthByEmailCommandHandler';

@Service()
export class RegisterClientCommandHandler implements ICommandHandler<RegisterClientCommand, boolean> {
    @Inject()
    private readonly _createAuthByEmailCommandHandler: CreateAuthByEmailCommandHandler;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async handle(param: RegisterClientCommand): Promise<boolean> {
        const data = new Client({ id: v4() } as IClient);
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;

        const auth = new CreateAuthByEmailCommand();
        auth.userId = data.id;
        auth.email = data.email;
        auth.password = param.password;

        const isExistEmail = await this._clientRepository.checkEmailExist(data.email);
        if (isExistEmail)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        const isExistUsername = await this._authRepository.getByUsername(data.email);
        if (isExistUsername)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        data.roleId = RoleId.CLIENT;
        data.status = ClientStatus.INACTIVE;
        data.activeKey = crypto.randomBytes(32).toString('hex');
        data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);

        const id = await this._clientRepository.create(data);
        if (!id)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        const name = `${data.firstName} ${data.lastName}`;
        this._mailService.sendUserActivation(name, data.email, data.activeKey);

        await this._createAuthByEmailCommandHandler.handle(auth);
        return true;
    }
}
