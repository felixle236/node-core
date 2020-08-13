export class WebSocketOptions {
    port: number;
    redisAdapter: WebSocketRedisAdapter;

    controllerPaths: string[];
    middlewarePaths: string[];
}

export class WebSocketRedisAdapter {
    constructor(public host: string, public port: number) {}
}
