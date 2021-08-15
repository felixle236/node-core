/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { AuthType } from '@domain/enums/auth/AuthType';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { mockWebSocket } from '@shared/test/MockWebSocket';
import { GetUserAuthByJwtQueryHandler } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { GetUserAuthByJwtQueryOutput } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryOutput';
import { UpdateUserOnlineStatusCommandHandler } from '@usecases/user/user/commands/update-user-online-status/UpdateUserOnlineStatusCommandHandler';
import { UpdateUserOnlineStatusCommandOutput } from '@usecases/user/user/commands/update-user-online-status/UpdateUserOnlineStatusCommandOutput';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Server } from 'socket.io';
import io, { Socket } from 'socket.io-client';
import Container from 'typedi';
import { v4 } from 'uuid';
import ChatChannel from './ChatChannel';

describe('Chat channel', () => {
    const sandbox = createSandbox();
    let server: Server;
    let socket: Socket;
    const port = 5001;
    const endpoint = `http://localhost:${port}/chat`;
    let getUserAuthByJwtQueryHandler: GetUserAuthByJwtQueryHandler;
    let updateUserOnlineStatusCommandHandler: UpdateUserOnlineStatusCommandHandler;

    before(() => {
        Container.set(GetUserAuthByJwtQueryHandler, { handle() {} });
        Container.set(UpdateUserOnlineStatusCommandHandler, { handle() {} });

        getUserAuthByJwtQueryHandler = Container.get(GetUserAuthByJwtQueryHandler);
        updateUserOnlineStatusCommandHandler = Container.get(UpdateUserOnlineStatusCommandHandler);

        server = mockWebSocket(port);
        const channel = Container.get(ChatChannel);
        channel.init(server);
    });

    afterEach(() => {
        if (socket.connected)
            socket.close();
        sandbox.restore();
    });

    after(done => {
        Container.reset();
        server.close(done);
    });

    it('Connect socket without token', done => {
        sandbox.stub(getUserAuthByJwtQueryHandler, 'handle').throwsException(new UnauthorizedError(MessageError.PARAM_INVALID, 'token'));

        socket = io(endpoint, {
            reconnection: false,
            transports: ['websocket'],
            auth: { token: 'token' }
        });

        socket.on('connect_error', (err: Error) => {
            expect(err.message).to.be.eq(new UnauthorizedError(MessageError.PARAM_INVALID, 'token').message);
            done();
        });
    });

    it('Connect socket', done => {
        const result = new GetUserAuthByJwtQueryOutput();
        result.setData({
            userId: v4(),
            roleId: v4(),
            type: AuthType.PERSONAL_EMAIL
        });
        sandbox.stub(getUserAuthByJwtQueryHandler, 'handle').resolves(result);

        const updateResult = new UpdateUserOnlineStatusCommandOutput();
        updateResult.setData(true);
        sandbox.stub(updateUserOnlineStatusCommandHandler, 'handle').resolves(updateResult);

        socket = io(endpoint, {
            reconnection: false,
            transports: ['websocket'],
            auth: { token: 'token' }
        });

        socket.on('connect', done);
    });

    it('Connect socket and update user online status', done => {
        const userId = v4();
        const result = new GetUserAuthByJwtQueryOutput();
        result.setData({
            userId: userId,
            roleId: v4(),
            type: AuthType.PERSONAL_EMAIL
        });
        sandbox.stub(getUserAuthByJwtQueryHandler, 'handle').resolves(result);

        const updateResult = new UpdateUserOnlineStatusCommandOutput();
        updateResult.setData(true);
        sandbox.stub(updateUserOnlineStatusCommandHandler, 'handle').resolves(updateResult);

        socket = io(endpoint, {
            reconnection: false,
            transports: ['websocket'],
            auth: { token: 'token' }
        });

        socket.on('online_status_changed', (onlineStatus: {userId: string, isOnline: boolean}) => {
            expect(onlineStatus.userId).to.be.eq(userId);
            expect(onlineStatus.isOnline).to.be.eq(true);
            done();
        });
    });

    it('Disconnect socket', done => {
        const result = new GetUserAuthByJwtQueryOutput();
        result.setData({
            userId: v4(),
            roleId: v4(),
            type: AuthType.PERSONAL_EMAIL
        });
        sandbox.stub(getUserAuthByJwtQueryHandler, 'handle').resolves(result);

        const updateResult = new UpdateUserOnlineStatusCommandOutput();
        updateResult.setData(true);
        sandbox.stub(updateUserOnlineStatusCommandHandler, 'handle').resolves(updateResult);

        socket = io(endpoint, {
            reconnection: false,
            transports: ['websocket'],
            auth: { token: 'token' }
        });

        socket.on('connect', () => {
            socket.disconnect();
        });

        socket.on('disconnect', () => {
            setTimeout(done, 10);
        });
    });
});
