import 'reflect-metadata';
import 'mocha';
import { mockWebSocket } from '@shared/test/MockWebSocket';
import { createSandbox } from 'sinon';
import { Server } from 'socket.io';
import io, { Socket } from 'socket.io-client';
import Container from 'typedi';
import TrackingChannel from './TrackingChannel';

describe('Tracking channel', () => {
    const sandbox = createSandbox();
    let server: Server;
    let socket: Socket;
    const port = 5003;
    const endpoint = `http://localhost:${port}/tracking`;

    before(() => {
        server = mockWebSocket(port);
        const channel = Container.get(TrackingChannel);
        channel.init(server);
    });

    afterEach(() => {
        if (socket.connected)
            socket.close();
        sandbox.restore();
    });

    after(done => {
        Container.reset();
        server._nsps.clear();
        server.close(done);
    });

    it('Connect socket', done => {
        socket = io(endpoint, {
            reconnection: false,
            transports: ['websocket']
        });

        socket.on('connect', done);
    });
});
