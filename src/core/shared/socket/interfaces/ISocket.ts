import { UserAuthenticated } from '@shared/UserAuthenticated';
import { Socket } from 'socket.io';

export interface ISocket extends Socket {
    userAuth?: UserAuthenticated;
}
