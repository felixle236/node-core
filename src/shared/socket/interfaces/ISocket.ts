import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { Socket } from 'socket.io';

export interface ISocket extends Socket {
  userAuth?: UserAuthenticated;
}
