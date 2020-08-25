export class SocketServerOptions {
    port: number;
    redisAdapter: SocketServerRedisAdapter;

    controllers: string[];
    middlewares: string[];
}

export class SocketServerRedisAdapter {
    constructor(public host: string, public port: number) {}
}
