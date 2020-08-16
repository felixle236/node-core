import { Socket } from 'socket.io';
import { UserAuthenticated } from '../UserAuthenticated';

export interface ISocket extends Socket {
    userAuth: UserAuthenticated;
}
