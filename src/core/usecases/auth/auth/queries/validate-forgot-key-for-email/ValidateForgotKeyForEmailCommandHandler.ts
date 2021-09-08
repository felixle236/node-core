import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { ValidateForgotKeyForEmailCommandInput } from './ValidateForgotKeyForEmailCommandInput';
import { ValidateForgotKeyForEmailCommandOutput } from './ValidateForgotKeyForEmailCommandOutput';

@Service()
export class ValidateForgotKeyForEmailCommandHandler extends CommandHandler<ValidateForgotKeyForEmailCommandInput, ValidateForgotKeyForEmailCommandOutput> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(param: ValidateForgotKeyForEmailCommandInput): Promise<ValidateForgotKeyForEmailCommandOutput> {
        await validateDataInput(param);

        let isValid = true;
        const auth = await this._authRepository.getByUsername(param.email);

        if (!auth || !auth.user || auth.forgotKey !== param.forgotKey || !auth.forgotExpire || auth.forgotExpire < new Date())
            isValid = false;
        else if (auth.user.roleId === RoleId.Client) {
            const client = await this._clientRepository.getById(auth.userId);
            if (!client || client.status !== ClientStatus.Actived)
                isValid = false;
        }
        else {
            const manager = await this._managerRepository.getById(auth.userId);
            if (!manager || manager.status !== ManagerStatus.Actived)
                isValid = false;
        }

        const result = new ValidateForgotKeyForEmailCommandOutput();
        result.setData(isValid);
        return result;
    }
}
