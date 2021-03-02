import { Inject, Service } from 'typedi';
import { DeleteClientCommand } from './DeleteClientCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { IClientRepository } from '../../../../gateways/repositories/client/IClientRepository';

@Service()
export class DeleteClientCommandHandler implements ICommandHandler<DeleteClientCommand, boolean> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(param: DeleteClientCommand): Promise<boolean> {
        if (param.roleAuthId !== RoleId.SUPER_ADMIN)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const client = await this._clientRepository.getById(param.id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const hasSucceed = await this._clientRepository.softDelete(param.id);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return hasSucceed;
    }
}
