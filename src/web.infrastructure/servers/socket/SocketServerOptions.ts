export class SocketServerOptions {
    port: number;
    redisAdapter: SocketServerRedisAdapter;

    controllerPaths: string[];
    middlewarePaths: string[];
}

export class SocketServerRedisAdapter {
    constructor(public host: string, public port: number) {}
}
