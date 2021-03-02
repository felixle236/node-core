import { Inject, Service } from 'typedi';
import { ArchiveClientCommand } from './ArchiveClientCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Client } from '../../../../domain/entities/client/Client';
import { ClientStatus } from '../../../../domain/enums/client/ClientStatus';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { IClientRepository } from '../../../../gateways/repositories/client/IClientRepository';

@Service()
export class ArchiveClientCommandHandler implements ICommandHandler<ArchiveClientCommand, boolean> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(param: ArchiveClientCommand): Promise<boolean> {
        if (param.roleAuthId !== RoleId.SUPER_ADMIN)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const client = await this._clientRepository.getById(param.id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const data = new Client();
        data.status = ClientStatus.ARCHIVED;
        data.archivedAt = new Date();

        const hasSucceed = await this._clientRepository.update(param.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return hasSucceed;
    }
}
