import { Inject, Service } from 'typedi';
import { IContactStatusRepository } from '../../../gateways/repositories/IContactStatusRepository';
import { IInteractor } from '../../../domain/common/IInteractor';
import { RoleId } from '../../../domain/enums/RoleId';
import { SocketInput } from '../../../domain/common/inputs/SocketInput';

@Service()
export class DisconnectSocketInteractor implements IInteractor<SocketInput<unknown>, void> {
    @Inject('contact.status.repository')
    private readonly _contactStatusRepository: IContactStatusRepository;

    async handle(param: SocketInput<unknown>): Promise<void> {
        const socket = param.socket;
        await this._contactStatusRepository.removeOnlineStatus(socket.userAuth.userId);
        if (socket.userAuth.role.id !== RoleId.SUPER_ADMIN)
            socket.nsp.emit('online_status', { id: socket.userAuth.userId, isOnline: false });
    }
}