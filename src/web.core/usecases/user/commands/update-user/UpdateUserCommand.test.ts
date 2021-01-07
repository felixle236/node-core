import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { UpdateUserCommand } from './UpdateUserCommand';
import { UpdateUserCommandHandler } from './UpdateUserCommandHandler';
import { addDays } from '../../../../../libs/date';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/user/User';
import { GenderType } from '../../../../domain/enums/user/GenderType';
import { IRole } from '../../../../domain/types/role/IRole';
import { IUser } from '../../../../domain/types/user/IUser';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';

Container.set('user.repository', {
    async getById() {},
    async update() {}
});
const userRepository = Container.get<IUserRepository>('user.repository');
const updateUserCommandHandler = Container.get(UpdateUserCommandHandler);

const roleData = { id: uuid.v4(), name: 'Role 2' } as IRole;
const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: roleData.id, role: roleData, firstName: 'User', lastName: '1', email: 'user1@localhost.com' } as IUser);
};

describe('User - Update user', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Update user without id', async () => {
        const param = new UpdateUserCommand();

        const result = await updateUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'id'));
    });

    it('Update user without first name', async () => {
        const param = new UpdateUserCommand();
        param.id = user.id;

        const result = await updateUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'first name'));
    });

    it('Update user with the length of first name greater than 20 characters', async () => {
        const param = new UpdateUserCommand();
        param.id = user.id;
        param.firstName = 'This is the first name with length greater than 20 characters!';

        const result = await updateUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'first name', 20));
    });

    it('Update user with the length of last name greater than 20 characters', async () => {
        const param = new UpdateUserCommand();
        param.id = user.id;
        param.firstName = 'Test';
        param.lastName = 'This is the last name with length greater than 20 characters!';

        const result = await updateUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'last name', 20));
    });

    it('Update user with gender is invalid', async () => {
        const param = new UpdateUserCommand();
        param.id = user.id;
        param.firstName = 'Test';
        param.lastName = '1';
        param.gender = 'test' as GenderType;

        const result = await updateUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'gender'));
    });

    it('Update user with birthday is not a date', async () => {
        const param = new UpdateUserCommand();
        param.id = user.id;
        param.firstName = 'Test';
        param.lastName = '1';
        param.gender = GenderType.MALE;
        param.birthday = 'abc';

        const result = await updateUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'birthday'));
    });

    it('Update user with birthday greater than today', async () => {
        const param = new UpdateUserCommand();
        param.id = user.id;
        param.firstName = 'Test';
        param.lastName = '1';
        param.gender = GenderType.MALE;
        param.birthday = addDays(new Date(), 1).toDateString();

        const result = await updateUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'birthday'));
    });

    it('Update user with the length of phone greater than 20 characters', async () => {
        const param = new UpdateUserCommand();
        param.id = user.id;
        param.firstName = 'Test';
        param.lastName = '1';
        param.gender = GenderType.MALE;
        param.birthday = new Date().toDateString();
        param.phone = 'This is the phone number with length greater than 20 characters!';

        const result = await updateUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'phone', 20));
    });

    it('Update user with the length of address greater than 200 characters', async () => {
        const param = new UpdateUserCommand();
        param.id = user.id;
        param.firstName = 'Test';
        param.lastName = '1';
        param.gender = GenderType.MALE;
        param.birthday = new Date().toDateString();
        param.phone = '0123456789';
        param.address = 'This is the address with length greater than 200 characters!';
        while (param.address.length <= 200) param.address += param.address;

        const result = await updateUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'address', 200));
    });

    it('Update user with the length of culture is not 5 characters', async () => {
        const param = new UpdateUserCommand();
        param.id = user.id;
        param.firstName = 'Test';
        param.lastName = '1';
        param.gender = GenderType.MALE;
        param.birthday = new Date().toDateString();
        param.phone = '0123456789';
        param.address = '123abc';
        param.culture = 'This is the culture with length is not 5 characters!';

        const result = await updateUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_EQUAL, 'culture', 5));
    });

    it('Update user with the length of currency is not 3 characters', async () => {
        const param = new UpdateUserCommand();
        param.id = user.id;
        param.firstName = 'Test';
        param.lastName = '1';
        param.gender = GenderType.MALE;
        param.birthday = new Date().toDateString();
        param.phone = '0123456789';
        param.address = '123abc';
        param.culture = 'US-en';
        param.currency = 'This is the currency with length is not 3 characters!';

        const result = await updateUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_EQUAL, 'currency', 3));
    });

    it('Update user with data not found', async () => {
        sandbox.stub(userRepository, 'getById').resolves(undefined);
        const param = new UpdateUserCommand();
        param.id = user.id;
        param.firstName = 'Test';
        param.lastName = '1';

        const result = await updateUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_NOT_FOUND));
    });

    it('Update user with data cannot save', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        sandbox.stub(userRepository, 'update').resolves(false);
        const param = new UpdateUserCommand();
        param.id = user.id;
        param.firstName = 'Test';
        param.lastName = '1';

        const result = await updateUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Update user successfully', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        sandbox.stub(userRepository, 'update').resolves(true);
        const param = new UpdateUserCommand();
        param.id = user.id;
        param.firstName = 'Test';
        param.lastName = '1';

        const hasSucceed = await updateUserCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
