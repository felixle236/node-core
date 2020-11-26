export class SocketServerRedisAdapter {
    constructor(public host: string, public port: number, public pass?: string, public prefix?: string) {}
}

export class SocketServerOptions {
    port: number;
    redisAdapter: SocketServerRedisAdapter;

    controllers: string[];
    middlewares: string[];
}
