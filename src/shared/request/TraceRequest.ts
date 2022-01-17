import { randomUUID } from 'crypto';
import { IncomingHttpHeaders } from 'http';
import { ISocket } from 'shared/socket/interfaces/ISocket';
import { HttpHeaderKey } from 'shared/types/Common';

export class TraceRequest {
  id: string;

  getFromHttpHeader(headers: IncomingHttpHeaders): void {
    if (!headers[HttpHeaderKey.Trace]) {
      headers[HttpHeaderKey.Trace] = randomUUID();
    }
    this.id = headers[HttpHeaderKey.Trace] as string;
  }

  setToHttpHeader(headers: IncomingHttpHeaders): void {
    headers[HttpHeaderKey.Trace] = this.id || randomUUID();
  }

  getFromSocket(socket: ISocket): void {
    this.id = socket.id;
  }
}
