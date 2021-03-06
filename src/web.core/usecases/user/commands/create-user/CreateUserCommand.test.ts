import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { CreateUserCommand } from './CreateUserCommand';
import { CreateUserCommandHandler } from './CreateUserCommandHandler';
import { addDays, formatDateString } from '../../../../../libs/date';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/user/User';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { GenderType } from '../../../../domain/enums/user/GenderType';
import { IRole } from '../../../../domain/types/role/IRole';
import { IUser } from '../../../../domain/types/user/IUser';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { CreateAuthByEmailCommandHandler } from '../../../auth/commands/create-auth-by-email/CreateAuthByEmailCommandHandler';

Container.set('role.repository', {
    async getById() {}
});
Container.set('user.repository', {
    async checkEmailExist() {},
    async create() {}
});

const roleRepository = Container.get<IRoleRepository>('role.repository');
const userRepository = Container.get<IUserRepository>('user.repository');
const createUserCommandHandler = Container.get(CreateUserCommandHandler);
const createAuthByEmailCommandHandler = Container.get(CreateAuthByEmailCommandHandler);

const roleData = { id: RoleId.SUPER_ADMIN, name: 'Role 2' } as IRole;
const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: roleData.id, role: roleData, firstName: 'User', lastName: '1', email: 'user1@localhost.com' } as IUser);
};

describe('User - Create user', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Create user without role', async () => {
        const param = new CreateUserCommand();

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'role'));
    });

    it('Create user with role is invalid', async () => {
        const param = new CreateUserCommand();
        param.roleId = 'test' as RoleId;

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'role'));
    });

    it('Create user without first name', async () => {
        const param = new CreateUserCommand();
        param.roleId = user.roleId;

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'first name'));
    });

    it('Create user with the length of first name greater than 20 characters', async () => {
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'This is the first name with length greater than 20 characters!';

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'first name', 20));
    });

    it('Create user with the length of last name greater than 20 characters', async () => {
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = 'This is the last name with length greater than 20 characters!';

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'last name', 20));
    });

    it('Create user without email', async () => {
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = '1';

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'email'));
    });

    it('Create user with email is invalid', async () => {
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@abc';

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'email'));
    });

    it('Create user with the length of email greater than 120 characters', async () => {
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test.localhost.test.localhost.test.localhost.localhost.localhost@test-asdfaasdfasfdgsgdsfasdfaasdfasfdgsgdsf-localhost.com';

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'email', 120));
    });

    it('Create user with gender is invalid', async () => {
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';
        param.gender = 'test' as GenderType;

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'gender'));
    });

    it('Create user with birthday is not a date', async () => {
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';
        param.gender = GenderType.MALE;
        param.birthday = 'abc';

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'birthday'));
    });

    it('Create user with birthday greater than today', async () => {
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';
        param.gender = GenderType.MALE;
        param.birthday = formatDateString(addDays(new Date(), 1));

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'birthday'));
    });

    it('Create user with the length of phone greater than 20 characters', async () => {
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';
        param.gender = GenderType.MALE;
        param.birthday = formatDateString(addDays(new Date(), -1));
        param.phone = 'This is the phone number with length greater than 20 characters!';

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'phone', 20));
    });

    it('Create user with the length of address greater than 200 characters', async () => {
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';
        param.gender = GenderType.MALE;
        param.birthday = formatDateString(addDays(new Date(), -1));
        param.phone = '0123456789';
        param.address = 'This is the address with length greater than 200 characters!';
        while (param.address.length <= 200) param.address += param.address;

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'address', 200));
    });

    it('Create user with the length of culture is not 5 characters', async () => {
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';
        param.gender = GenderType.MALE;
        param.birthday = formatDateString(addDays(new Date(), -1));
        param.phone = '0123456789';
        param.address = '123abc';
        param.culture = 'This is the culture with length is not 5 characters!';

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_EQUAL, 'culture', 5));
    });

    it('Create user with the length of currency is not 3 characters', async () => {
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';
        param.gender = GenderType.MALE;
        param.birthday = formatDateString(addDays(new Date(), -1));
        param.phone = '0123456789';
        param.address = '123abc';
        param.culture = 'US-en';
        param.currency = 'This is the currency with length is not 3 characters!';

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_EQUAL, 'currency', 3));
    });

    it('Create user with email is existed', async () => {
        sandbox.stub(userRepository, 'checkEmailExist').resolves(true);
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_EXISTED, 'email'));
    });

    it('Create user with role is not exist', async () => {
        sandbox.stub(userRepository, 'checkEmailExist').resolves(false);
        sandbox.stub(roleRepository, 'getById').resolves(null);
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_NOT_EXISTS, 'role'));
    });

    it('Create user with data cannot save', async () => {
        sandbox.stub(userRepository, 'checkEmailExist').resolves(false);
        sandbox.stub(roleRepository, 'getById').resolves(user.role);
        sandbox.stub(userRepository, 'create').resolves(null);
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await createUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Create user successfully', async () => {
        sandbox.stub(userRepository, 'checkEmailExist').resolves(false);
        sandbox.stub(roleRepository, 'getById').resolves(user.role);
        sandbox.stub(userRepository, 'create').resolves(user.id);
        sandbox.stub(createAuthByEmailCommandHandler, 'handle').resolves();
        const param = new CreateUserCommand();
        param.roleId = user.roleId;
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await createUserCommandHandler.handle(param);
        expect(result).to.eq(user.id);
    });
});
