import crypto from 'crypto';
import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IClient } from '@domain/interfaces/user/IClient';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IMailService } from '@gateways/services/IMailService';
import { addSeconds } from '@libs/date';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateAuthByEmailCommandHandler } from '@usecases/auth/auth/commands/create-auth-by-email/CreateAuthByEmailCommandHandler';
import { CreateAuthByEmailCommandInput } from '@usecases/auth/auth/commands/create-auth-by-email/CreateAuthByEmailCommandInput';
import { Inject, Service } from 'typedi';
import { v4 } from 'uuid';
import { RegisterClientCommandInput } from './RegisterClientCommandInput';
import { RegisterClientCommandOutput } from './RegisterClientCommandOutput';

@Service()
export class RegisterClientCommandHandler extends CommandHandler<RegisterClientCommandInput, RegisterClientCommandOutput> {
    @Inject()
    private readonly _createAuthByEmailCommandHandler: CreateAuthByEmailCommandHandler;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async handle(param: RegisterClientCommandInput): Promise<RegisterClientCommandOutput> {
        const data = new Client({ id: v4() } as IClient);
        data.roleId = RoleId.CLIENT;
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;

        const auth = new CreateAuthByEmailCommandInput();
        auth.userId = data.id;
        auth.email = data.email;
        auth.password = param.password;

        const isExistEmail = await this._clientRepository.checkEmailExist(data.email);
        if (isExistEmail)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        const isExistUsername = await this._authRepository.getByUsername(data.email);
        if (isExistUsername)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        data.status = ClientStatus.INACTIVED;
        data.activeKey = crypto.randomBytes(32).toString('hex');
        data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);

        const id = await this._clientRepository.create(data);
        if (!id)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        const name = `${data.firstName} ${data.lastName}`;
        this._mailService.sendUserActivation(name, data.email, data.activeKey);

        await this._createAuthByEmailCommandHandler.handle(auth);
        const result = new RegisterClientCommandOutput();
        result.setData(true);
        return result;
    }
}
