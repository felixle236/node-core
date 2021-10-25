import { randomUUID } from 'crypto';
import { IncomingHttpHeaders } from 'http';
import { ISocket } from '@shared/socket/interfaces/ISocket';

export class TraceRequest {
    static HTTP_HEADER_KEY = 'x-trace';

    id: string;

    getFromHttpHeader(headers: IncomingHttpHeaders): void {
        if (!headers[TraceRequest.HTTP_HEADER_KEY])
            headers[TraceRequest.HTTP_HEADER_KEY] = randomUUID();
        this.id = headers[TraceRequest.HTTP_HEADER_KEY] as string;
    }

    setToHttpHeader(headers: IncomingHttpHeaders): void {
        headers[TraceRequest.HTTP_HEADER_KEY] = this.id || randomUUID();
    }

    getFromSocket(socket: ISocket): void {
        this.id = socket.id;
    }
}
