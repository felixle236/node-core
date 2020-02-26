import { Socket } from 'socket.io';
import { UserAuthenticated } from '../../dtos/user/UserAuthenticated';

export interface ISocket extends Socket {
    userAuth: UserAuthenticated;
}
