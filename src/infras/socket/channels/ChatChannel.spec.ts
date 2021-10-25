import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { AuthType } from '@domain/enums/auth/AuthType';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { mockUsecase } from '@shared/test/MockUsecase';
import { mockWebSocket } from '@shared/test/MockWebSocket';
import { GetUserAuthByJwtHandler } from '@usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtHandler';
import { GetUserAuthByJwtData, GetUserAuthByJwtOutput } from '@usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtOutput';
import { UpdateUserOnlineStatusHandler } from '@usecases/user/user/update-user-online-status/UpdateUserOnlineStatusHandler';
import { UpdateUserOnlineStatusOutput } from '@usecases/user/user/update-user-online-status/UpdateUserOnlineStatusOutput';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Server } from 'socket.io';
import io, { Socket } from 'socket.io-client';
import Container from 'typedi';
import ChatChannel from './ChatChannel';

describe('Chat channel', () => {
    const sandbox = createSandbox();
    let server: Server;
    let socket: Socket;
    const port = 5001;
    const endpoint = `http://localhost:${port}/chat`;
    let getUserAuthByJwtHandler: GetUserAuthByJwtHandler;
    let updateUserOnlineStatusHandler: UpdateUserOnlineStatusHandler;

    before(() => {
        Container.set(GetUserAuthByJwtHandler, mockUsecase());
        Container.set(UpdateUserOnlineStatusHandler, mockUsecase());

        getUserAuthByJwtHandler = Container.get(GetUserAuthByJwtHandler);
        updateUserOnlineStatusHandler = Container.get(UpdateUserOnlineStatusHandler);

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
        sandbox.stub(getUserAuthByJwtHandler, 'handle').throwsException(new UnauthorizedError(MessageError.PARAM_INVALID, { t: 'token' }));

        socket = io(endpoint, {
            reconnection: false,
            transports: ['websocket'],
            auth: { token: 'token' }
        });

        socket.on('connect_error', (err: Error) => {
            expect(err.message).to.be.eq(new UnauthorizedError(MessageError.PARAM_INVALID, { t: 'token' }).message);
            done();
        });
    });

    it('Connect socket', done => {
        const result = new GetUserAuthByJwtOutput();
        result.data = new GetUserAuthByJwtData();
        result.data.userId = randomUUID();
        result.data.roleId = randomUUID();
        result.data.type = AuthType.PersonalEmail;

        sandbox.stub(getUserAuthByJwtHandler, 'handle').resolves(result);

        const updateResult = new UpdateUserOnlineStatusOutput();
        updateResult.data = true;
        sandbox.stub(updateUserOnlineStatusHandler, 'handle').resolves(updateResult);

        socket = io(endpoint, {
            reconnection: false,
            transports: ['websocket'],
            auth: { token: 'token' }
        });

        socket.on('connect', done);
    });

    it('Connect socket and update user online status', done => {
        const userId = randomUUID();
        const result = new GetUserAuthByJwtOutput();
        result.data = new GetUserAuthByJwtData();
        result.data.userId = userId;
        result.data.roleId = randomUUID();
        result.data.type = AuthType.PersonalEmail;

        sandbox.stub(getUserAuthByJwtHandler, 'handle').resolves(result);

        const updateResult = new UpdateUserOnlineStatusOutput();
        updateResult.data = true;
        sandbox.stub(updateUserOnlineStatusHandler, 'handle').resolves(updateResult);

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
        const result = new GetUserAuthByJwtOutput();
        result.data = new GetUserAuthByJwtData();
        result.data.userId = randomUUID();
        result.data.roleId = randomUUID();
        result.data.type = AuthType.PersonalEmail;

        sandbox.stub(getUserAuthByJwtHandler, 'handle').resolves(result);

        const updateResult = new UpdateUserOnlineStatusOutput();
        updateResult.data = true;
        sandbox.stub(updateUserOnlineStatusHandler, 'handle').resolves(updateResult);

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
