import { Inject, Service } from 'typedi';
import { AuthenticateInput } from '../../auth/authenticate/Input';
import { AuthenticateInteractor } from '../../auth/authenticate/Interactor';
import { IContactStatusRepository } from '../../../gateways/repositories/IContactStatusRepository';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { RoleId } from '../../../domain/enums/RoleId';
import { SocketInput } from '../../../domain/common/socket/SocketInput';

@Service()
export class ConnectSocketInteractor implements IInteractor<SocketInput<string>, void> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('contact.status.repository')
    private readonly _contactStatusRepository: IContactStatusRepository;

    @Inject()
    private readonly _authenticateInteractor: AuthenticateInteractor;

    async handle(param: SocketInput<string>): Promise<void> {
        const socket = param.socket;
        try {
            const authenticateInput = new AuthenticateInput(param.data);
            socket.userAuth = await this._authenticateInteractor.handle(authenticateInput);
        }
        catch (error) {
            socket.emit('connect_error', error);
        }

        if (!socket.userAuth)
            socket.disconnect(true);
        else {
            const user = await this._userRepository.getById(socket.userAuth.userId);
            if (!user)
                socket.disconnect(true);
            else {
                await this._contactStatusRepository.addOnlineStatus(socket.userAuth.userId);
                socket.join(socket.userAuth.userId);
                socket.join('0');

                if (user.role && user.role.id !== RoleId.SUPER_ADMIN)
                    socket.nsp.emit('online_status', { id: socket.userAuth.userId, isOnline: true });
            }
        }
    }
}
