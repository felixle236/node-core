import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import * as ioClient from 'socket.io-client';
import { SinonSandbox, createSandbox } from 'sinon';
import { GenderType } from '../../constants/Enums';
import { IMessage } from '../../web.core/interfaces/models/IMessage';
import { IRole } from '../../web.core/interfaces/models/IRole';
import { ISocket } from '../../web.core/interfaces/types/ISocket';
import { IUser } from '../../web.core/interfaces/models/IUser';
import { MemberResponse } from '../../web.core/dtos/member/responses/MemberResponse';
import { Message } from '../../web.core/models/Message';
import { MessageBusiness } from '../../web.core/businesses/MessageBusiness';
import { MessageResponse } from '../../web.core/dtos/message/responses/MessageResponse';
import { MessageRoomResponse } from '../../web.core/dtos/message/responses/MessageRoomResponse';
import { ResultListResponse } from '../../web.core/dtos/common/ResultListResponse';
import { Role } from '../../web.core/models/Role';
import { SocketIOEmitter } from 'socket.io-emitter';
import { SocketService } from '../../web.socket/SocketService';
import { User } from '../../web.core/models/User';
import { UserAuthenticated } from '../../web.core/dtos/user/UserAuthenticated';
import { expect } from 'chai';
import { mapModels } from '../../libs/common';

const generateUsers = () => {
    return [
        new User({ id: 1, createdAt: new Date(), updatedAt: new Date(), roleId: 1, role: { id: 1, name: 'Role 1' } as IRole, firstName: 'Test', lastName: '1', email: 'test.1@localhost.com', gender: GenderType.Male, birthday: new Date(), avatar: '/images/test-1-icon.png' } as IUser),
        new User({ id: 2, createdAt: new Date(), updatedAt: new Date(), roleId: 2, role: { id: 2, name: 'Role 2' } as IRole, firstName: 'Test', lastName: '2', email: 'test.2@localhost.com', gender: GenderType.Male, birthday: new Date(), avatar: '/images/test-2-icon.png' } as IUser),
        new User({ id: 3, createdAt: new Date(), updatedAt: new Date(), roleId: 2, role: { id: 2, name: 'Role 2' } as IRole, firstName: 'Test', lastName: '2', email: 'test.3@localhost.com', gender: GenderType.Male, birthday: new Date(), avatar: '/images/test-3-icon.png' } as IUser),
        new User({ id: 12345, createdAt: new Date(), updatedAt: new Date(), roleId: 2, role: { id: 2, name: 'Role 2' } as IRole, firstName: 'Test', lastName: '2', email: 'test.12345@localhost.com', gender: GenderType.Male, birthday: new Date(), avatar: '/images/test-4-icon.png' } as IUser)
    ];
};

const generateMessages = () => {
    return [
        new Message({ id: 1, createdAt: new Date(), updatedAt: new Date(), senderId: 1, receiverId: 2, content: 'Content 1' } as IMessage),
        new Message({ id: 2, createdAt: new Date(), updatedAt: new Date(), senderId: 2, receiverId: 1, content: 'Content 2' } as IMessage),
        new Message({ id: 3, createdAt: new Date(), updatedAt: new Date(), senderId: 3, receiverId: 1, content: 'Content 3' } as IMessage)
    ];
};

describe('Message socket controller testing', () => {
    let sandbox: SinonSandbox;
    const url = 'http://localhost:5000';
    let socketServer: SocketIO.Server;
    let socketClient: SocketIOClient.Socket;
    let list: Message[];

    before(function() {
        this.timeout(6000);
        sandbox = createSandbox();
        sandbox.stub(SocketService, 'initAdapter').callsFake(socketServer => socketServer);
        sandbox.stub(SocketService, 'initEmitter').callsFake(() => ({} as SocketIOEmitter));

        socketServer = SocketService.start();
        socketServer.on('connection', (socket: ISocket) => {
            sandbox.stub(MessageBusiness.prototype, 'connect').resolves(socket);
        });
    });

    beforeEach(done => {
        list = generateMessages();
        const users = generateUsers();
        const userAuth = new UserAuthenticated();
        userAuth.id = users[0].id;
        userAuth.role = new Role({ id: users[0].roleId } as IRole);
        userAuth.accessToken = 'token';
        userAuth.claims = [];

        socketClient = ioClient(url + '/messages', { transports: ['websocket'] });
        socketClient.on('connect', done);
    });

    afterEach(() => {
        sandbox.restore();
        socketClient.close();
    });

    after(done => {
        socketServer.close(done);
    });

    it('Find messages', () => {
        sandbox.stub(MessageBusiness.prototype, 'find').resolves(new ResultListResponse(mapModels(MessageResponse, list), list.length, 0, 10));

        socketClient.on('message_list_successfully', data => {
            expect(data.pagination && data.results && Array.isArray(data.results) && data.results.length === list.length).to.eq(true);
        });
        socketClient.emit('message_list', { room: 0, keyword: 'test' });
    });

    it('Find members', () => {
        const users = generateUsers();
        sandbox.stub(MessageBusiness.prototype, 'findMembers').resolves(new ResultListResponse(mapModels(MemberResponse, users), users.length, 0, 10));

        socketClient.on('member_list_successfully', data => {
            expect(data.pagination && data.results && Array.isArray(data.results) && data.results.length === users.length).to.eq(true);
        });
        socketClient.emit('member_list', { keyword: 'test' });
    });

    it('Cretae message directly', () => {
        const message = new MessageResponse(list[0]);
        sandbox.stub(MessageBusiness.prototype, 'create').resolves(message);

        socketClient.on('message_directly_successfully', data => {
            expect(data && data.id === message.id).to.eq(true);
        });
        socketClient.emit('message_directly', { receiverId: 1, content: 'test' });
    });

    it('Cretae message room', () => {
        const message = new MessageRoomResponse(list[0]);
        sandbox.stub(MessageBusiness.prototype, 'createByRoom').resolves(message);

        socketClient.on('message_room_successfully', data => {
            expect(data && data.id === message.id).to.eq(true);
        });
        socketClient.emit('message_room', { room: 0, content: 'test' });
    });

    it('Update message status', () => {
        sandbox.stub(MessageBusiness.prototype, 'updateNewMessageStatus').resolves(true);

        socketClient.on('message_status_successfully', data => {
            expect(data).to.eq(true);
        });
        socketClient.emit('message_status', { room: 0 });
    });
});
