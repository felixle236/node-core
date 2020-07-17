import { Socket } from 'socket.io';
import { UserAuthenticated } from '../../dtos/common/UserAuthenticated';

export interface ISocket extends Socket {
    userAuth: UserAuthenticated;
}
