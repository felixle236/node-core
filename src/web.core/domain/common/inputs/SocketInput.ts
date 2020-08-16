import { ISocket } from '../socket/ISocket';

export class SocketInput<TInputParam> {
    socket: ISocket;
    data: TInputParam;

    constructor(socket: ISocket, data?: TInputParam) {
        this.socket = socket;
        if (data)
            this.data = data;
    }
}
