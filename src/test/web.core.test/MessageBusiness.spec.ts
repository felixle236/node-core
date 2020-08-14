import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import * as SocketMock from 'socket.io-mock';
import { AuthenticationBusiness } from '../../web.core/businesses/AuthenticationBusiness';
import { Container } from 'typedi';
import { IMessage } from '../../web.core/gateways/models/IMessage';
import { IMessageBusiness } from '../../web.core/gateways/businesses/IMessageBusiness';
import { IRole } from '../../web.core/gateways/models/IRole';
import { IUser } from '../../web.core/gateways/models/IUser';
import { ContactStatusRepository } from '../../web.infrastructure/data/redis/repositories/ContactStatusRepository';
import { Message } from '../../web.core/models/Message';
import { MessageCreateRequest } from '../../web.core/dtos/message/requests/MessageCreateRequest';
import { MessageFilterRequest } from '../../web.core/dtos/message/requests/MessageFilterRequest';
import { MessageRepository } from '../../web.infrastructure/data/typeorm/repositories/MessageRepository';
import { MessageRoomCreateRequest } from '../../web.core/dtos/message/requests/MessageRoomCreateRequest';
import { SystemError } from '../../web.core/dtos/common/Exception';
import { User } from '../../web.core/models/User';
import { UserAuthenticated } from '../../web.core/dtos/common/UserAuthenticated';
import { UserFilterRequest } from '../../web.core/dtos/user/requests/UserFilterRequest';
import { UserRepository } from '../../web.infrastructure/data/typeorm/repositories/UserRepository';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

const generateUsers = () => {
    return [
        new User({ id: 1, createdAt: new Date(), updatedAt: new Date(), roleId: 1, role: { id: 1, name: 'Role 1', level: 1 } as IRole, firstName: 'Test', lastName: '1', email: 'test.1@localhost.com', gender: GenderType.MALE, birthday: new Date(), avatar: '/images/test-1-icon.png' } as IUser),
        new User({ id: 2, createdAt: new Date(), updatedAt: new Date(), roleId: 2, role: { id: 2, name: 'Role 2', level: 2 } as IRole, firstName: 'Test', lastName: '2', email: 'test.2@localhost.com', gender: GenderType.MALE, birthday: new Date(), avatar: '/images/test-2-icon.png' } as IUser)
    ];
};

const generateMessages = () => {
    return [
        new Message({ id: 1, createdAt: new Date(), updatedAt: new Date(), senderId: generateUsers()[0].id, sender: generateUsers()[0] as IUser, receiverId: generateUsers()[1].id, receiver: generateUsers()[1] as IUser, content: 'Content 1' } as IMessage),
        new Message({ id: 2, createdAt: new Date(), updatedAt: new Date(), senderId: generateUsers()[0].id, sender: generateUsers()[0] as IUser, receiverId: generateUsers()[1].id, receiver: generateUsers()[1] as IUser, content: 'Content 2' } as IMessage),
        new Message({ id: 3, createdAt: new Date(), updatedAt: new Date(), senderId: generateUsers()[0].id, sender: generateUsers()[0] as IUser, receiverId: generateUsers()[1].id, receiver: generateUsers()[1] as IUser, content: 'Content 3' } as IMessage)
    ];
};

const generateUserAuth = (user: User) => {
    const userAuth = new UserAuthenticated();
    userAuth.userId = user.id;
    userAuth.role = user.role!;
    userAuth.accessToken = 'token';
    return userAuth;
};

const generateMessageCreate = () => {
    const messageCreate = new MessageCreateRequest();
    messageCreate.receiverId = generateUsers()[1].id;
    messageCreate.content = 'Test message';

    return messageCreate;
};

const generateMessageRoomCreate = () => {
    const messageCreate = new MessageRoomCreateRequest();
    messageCreate.room = 0;
    messageCreate.content = 'Test message';

    return messageCreate;
};

describe('Message business testing', () => {
    const sandbox = createSandbox();
    const messageBusiness = Container.get<IMessageBusiness>('message.business');
    let socket: SocketMock;
    let list: Message[];

    beforeEach(() => {
        list = generateMessages();
        const users = generateUsers();
        socket = new SocketMock();
        socket.nsp = socket;
        socket.userAuth = generateUserAuth(users[1]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Connect socket width access token invalid', async () => {
        const funcSpy = sandbox.spy();
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(undefined);
        socket.disconnect = funcSpy;
        socket.userAuth = undefined;

        await messageBusiness.connect(socket, 'access-token');
        expect(funcSpy.called).to.eq(true);
    });

    it('Connect socket width throw error', async () => {
        const funcSpy = sandbox.spy();
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').throws();
        socket.emit = funcSpy;
        socket.userAuth = undefined;
        socket.disconnect = sandbox.spy();

        await messageBusiness.connect(socket, 'access-token');
        expect(funcSpy.called).to.eq(true);
    });

    it('Connect socket width access token valid but user is not exists already', async () => {
        const funcSpy = sandbox.spy();
        const userAuth = socket.userAuth;
        socket.disconnect = funcSpy;
        socket.userAuth = undefined;
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(UserRepository.prototype, 'getById').resolves(undefined);

        await messageBusiness.connect(socket, 'access-token');
        expect(funcSpy.called).to.eq(true);
    });

    it('Connect socket successfully', async () => {
        const users = generateUsers();
        const user = users[0];
        const userAuth = socket.userAuth;
        socket.userAuth = undefined;
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(UserRepository.prototype, 'getById').resolves(user);
        sandbox.stub(ContactStatusRepository.prototype, 'addOnlineStatus').resolves();

        await messageBusiness.connect(socket, 'access-token');
        expect(!!socket.userAuth).to.eq(true);
    });

    it('Connect socket successfully and send member status message', async () => {
        const users = generateUsers();
        const user = users[1];
        const userAuth = socket.userAuth;
        socket.userAuth = undefined;
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(UserRepository.prototype, 'getById').resolves(user);
        sandbox.stub(ContactStatusRepository.prototype, 'addOnlineStatus').resolves();

        socket.socketClient.on('online_status', userInfo => {
            expect(userInfo.id === user.id && userInfo.isOnline === true).to.eq(true);
        });
        await messageBusiness.connect(socket, 'access-token');
    });

    it('Disconnect socket successfully', async () => {
        sandbox.stub(ContactStatusRepository.prototype, 'removeOnlineStatus').resolves(true);

        socket.socketClient.on('online_status', userInfo => {
            expect(userInfo.id).to.eq(socket.userAuth.userId);
        });
        await messageBusiness.disconnect(socket);
    });

    it('Find messages directly successfully', async () => {
        const users = generateUsers();
        sandbox.stub(MessageRepository.prototype, 'find').resolves([list, 3]);
        sandbox.stub(ContactStatusRepository.prototype, 'removeNewMessageStatus').resolves(true);

        const filter = new MessageFilterRequest();
        filter.keyword = '';
        filter.receiverId = users[1].id;

        const result = await messageBusiness.find(socket, filter);
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 3).to.eq(true);
    });

    it('Find messages room successfully', async () => {
        sandbox.stub(MessageRepository.prototype, 'find').resolves([list, 3]);
        sandbox.stub(ContactStatusRepository.prototype, 'removeNewMessageStatus').resolves(true);

        const filter = new MessageFilterRequest();
        filter.keyword = '';
        filter.room = 0;

        const result = await messageBusiness.find(socket, filter);
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 3).to.eq(true);
    });

    it('Find members successfully', async () => {
        const users = generateUsers();
        socket.connected = true;
        socket.nsp.sockets = { key: socket };
        sandbox.stub(UserRepository.prototype, 'findMembers').resolves([users, 2]);
        sandbox.stub(ContactStatusRepository.prototype, 'getListOnlineStatus').resolves([users[1].id]);
        sandbox.stub(ContactStatusRepository.prototype, 'getListNewMessageStatus').resolves([users[1].id]);

        const filter = new UserFilterRequest();
        filter.keyword = '';

        const result = await messageBusiness.findMembers(socket, filter);
        expect(Array.isArray(result.results) && result.results.length === users.length && result.pagination.total === 2).to.eq(true);
    });

    it('Create message without sender id', async () => {
        const data = generateMessageCreate();
        socket.userAuth.userId = undefined;

        await messageBusiness.create(socket, data).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'sender id').message);
        });
    });

    it('Create message with an invalid sender id', async () => {
        const data = generateMessageCreate();
        socket.userAuth.userId = 0;

        await messageBusiness.create(socket, data).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'sender id').message);
        });
    });

    it('Create message with an invalid receiver id', async () => {
        const data = generateMessageCreate();
        data.receiverId = 0;

        await messageBusiness.create(socket, data).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'receiver id').message);
        });
    });

    it('Create message without content', async () => {
        const data = generateMessageCreate();
        data.content = '';

        await messageBusiness.create(socket, data).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'content').message);
        });
    });

    it('Create message with an invalid content', async () => {
        const data = generateMessageCreate();
        data.content = 123 as any;

        await messageBusiness.create(socket, data).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'content').message);
        });
    });

    it('Create message with length content greater than 2000 characters', async () => {
        const data = generateMessageCreate();
        data.content = 'This is the password with length greater than 2000 characters!';
        while (data.content.length <= 2000) data.content += data.content;

        await messageBusiness.create(socket, data).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'content', 2000).message);
        });
    });

    it('Create message with sender id greater than receiver id', async () => {
        const message = list[0];
        sandbox.stub(MessageRepository.prototype, 'create').resolves(message.id);
        sandbox.stub(ContactStatusRepository.prototype, 'addNewMessageStatus').resolves(true);
        sandbox.stub(MessageRepository.prototype, 'getById').resolves(message);

        socket.userAuth.userId = 100;
        const data = generateMessageCreate();
        const result = await messageBusiness.create(socket, data);
        expect(result && result.id === message.id).to.eq(true);
    });

    it('Create message with sender id has string length greater than 4 characters', async () => {
        const message = list[0];
        sandbox.stub(MessageRepository.prototype, 'create').resolves(message.id);
        sandbox.stub(ContactStatusRepository.prototype, 'addNewMessageStatus').resolves(true);
        sandbox.stub(MessageRepository.prototype, 'getById').resolves(message);

        socket.userAuth.userId = 10000;
        const data = generateMessageCreate();
        const result = await messageBusiness.create(socket, data);
        expect(result && result.id === message.id).to.eq(true);
    });

    it('Create message with cannot save error', async () => {
        const data = generateMessageCreate();
        sandbox.stub(MessageRepository.prototype, 'create').resolves();

        await messageBusiness.create(socket, data).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(5).message);
        });
    });

    it('Create message successfully', async () => {
        const message = list[0];
        sandbox.stub(MessageRepository.prototype, 'create').resolves(message.id);
        sandbox.stub(ContactStatusRepository.prototype, 'addNewMessageStatus').resolves(true);
        sandbox.stub(MessageRepository.prototype, 'getById').resolves(message);

        const data = generateMessageCreate();
        const result = await messageBusiness.create(socket, data);
        expect(result && result.id === message.id).to.eq(true);
    });

    it('Create message room without room', async () => {
        const data = generateMessageRoomCreate();
        delete data.room;

        await messageBusiness.createByRoom(socket, data).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'room').message);
        });
    });

    it('Create message room with an invalid room', async () => {
        const data = generateMessageRoomCreate();
        data.room = -1;

        await messageBusiness.createByRoom(socket, data).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'room').message);
        });
    });

    it('Create message room with room is not exists', async () => {
        const data = generateMessageRoomCreate();
        data.room = 1;

        await messageBusiness.createByRoom(socket, data).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1004, 'room').message);
        });
    });

    it('Create message room with cannot save error', async () => {
        sandbox.stub(MessageRepository.prototype, 'create').resolves();

        const data = generateMessageRoomCreate();
        data.room = 0;

        await messageBusiness.createByRoom(socket, data).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(5).message);
        });
    });

    it('Create message room successfully', async () => {
        const message = list[0];
        sandbox.stub(MessageRepository.prototype, 'create').resolves(message.id);
        sandbox.stub(ContactStatusRepository.prototype, 'addNewMessageStatus').resolves(true);
        sandbox.stub(MessageRepository.prototype, 'getById').resolves(message);

        const data = generateMessageRoomCreate();
        data.room = 0;

        const result = await messageBusiness.createByRoom(socket, data);
        expect(result && result.id === message.id).to.eq(true);
    });

    it('Update new message status with an invalid room', async () => {
        await messageBusiness.updateNewMessageStatus(socket, -1).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'room').message);
        });
    });

    it('Update new message status successfully', async () => {
        sandbox.stub(ContactStatusRepository.prototype, 'removeNewMessageStatus').resolves(true);

        const hasSucceed = await messageBusiness.updateNewMessageStatus(socket, 0);
        expect(hasSucceed).to.eq(true);
    });
});
