import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import * as path from 'path';
import { BulkActionResponse } from '../../web.core/dtos/common/BulkActionResponse';
import { Container } from 'typedi';
import { Gender } from '../../constants/Enums';
import { IRole } from '../../web.core/interfaces/models/IRole';
import { IUser } from '../../web.core/interfaces/models/IUser';
import { IUserBusiness } from '../../web.core/interfaces/businesses/IUserBusiness';
import { Role } from '../../web.core/models/Role';
import { RoleRepository } from '../../web.infrastructure/data/typeorm/repositories/RoleRepository';
import { StorageService } from '../../web.infrastructure/medias/storage/StorageService';
import { SystemError } from '../../web.core/dtos/common/Exception';
import { User } from '../../web.core/models/User';
import { UserAuthenticated } from '../../web.core/dtos/user/UserAuthenticated';
import { UserCommonFilterRequest } from '../../web.core/dtos/user/requests/UserCommonFilterRequest';
import { UserCreateRequest } from '../../web.core/dtos/user/requests/UserCreateRequest';
import { UserFilterRequest } from '../../web.core/dtos/user/requests/UserFilterRequest';
import { UserPasswordUpdateRequest } from '../../web.core/dtos/user/requests/UserPasswordUpdateRequest';
import { UserRepository } from '../../web.infrastructure/data/typeorm/repositories/UserRepository';
import { UserUpdateRequest } from '../../web.core/dtos/user/requests/UserUpdateRequest';
import { createSandbox } from 'sinon';
import { expect } from 'chai';
import { readFile } from '../../libs/file';

const generateRole = () => {
    return new Role({ id: 2, createdAt: new Date(), updatedAt: new Date(), name: 'Role 2', level: 2 } as IRole);
};

const generateUsers = () => {
    return [
        new User({ id: 1, createdAt: new Date(), updatedAt: new Date(), roleId: 1, role: { id: 1, name: 'Role 1', level: 1 } as IRole, firstName: 'Test', lastName: '1', email: 'test.1@localhost.com', gender: Gender.Male, birthday: new Date(), avatar: '../../resources/images/test-1-icon.png' } as IUser),
        new User({ id: 2, createdAt: new Date(), updatedAt: new Date(), roleId: 2, role: { id: 2, name: 'Role 2', level: 2 } as IRole, firstName: 'Test', lastName: '2', email: 'test.2@localhost.com', gender: Gender.Male, birthday: new Date(), avatar: '../../resources/images/test-2-icon.png' } as IUser),
        new User({ id: 3, createdAt: new Date(), updatedAt: new Date(), roleId: 2, role: { id: 2, name: 'Role 2', level: 2 } as IRole, firstName: 'Test', lastName: '3', email: 'test.3@localhost.com', gender: Gender.Male, birthday: new Date(), avatar: '../../resources/images/test-3-icon.png' } as IUser)
    ];
};

const generateUserCreate = () => {
    const userCreate = new UserCreateRequest();
    userCreate.roleId = generateRole().id;
    userCreate.firstName = 'Test';
    userCreate.lastName = 'Local';
    userCreate.email = 'test@localhost.com';
    userCreate.password = 'Nodecore@2';
    userCreate.gender = Gender.Male;
    userCreate.birthday = new Date();
    userCreate.phone = '0123456789';
    userCreate.address = '123 Abc';
    userCreate.culture = 'en-US';
    userCreate.currency = 'USD';

    return userCreate;
};

const generateUserUpdate = () => {
    const userUpdate = new UserUpdateRequest();
    userUpdate.firstName = 'Test';
    userUpdate.lastName = 'Local';
    userUpdate.gender = Gender.Male;
    userUpdate.birthday = new Date();
    userUpdate.phone = '0123456789';
    userUpdate.address = '123 Abc';
    userUpdate.culture = 'en-US';
    userUpdate.currency = 'USD';

    return userUpdate;
};

describe('User business testing', () => {
    const sandbox = createSandbox();
    const userBusiness = Container.get<IUserBusiness>('user.business');
    let list: User[];
    let sampleList: any[];

    beforeEach(() => {
        list = generateUsers();
        sampleList = JSON.parse(JSON.stringify(require('../../resources/sample-data/users.json')));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Find users without param items', async () => {
        sandbox.stub(UserRepository.prototype, 'find').resolves([list, 10]);

        const result = await userBusiness.find(new UserFilterRequest());
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find users with permission', async () => {
        sandbox.stub(UserRepository.prototype, 'find').resolves([list, 10]);
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 1;

        const result = await userBusiness.find(new UserFilterRequest(), userAuth);
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find users with name or email', async () => {
        sandbox.stub(UserRepository.prototype, 'find').resolves([list, 10]);

        const filter = new UserFilterRequest();
        filter.keyword = 'localhost';

        const result = await userBusiness.find(filter);
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find common users without param items', async () => {
        sandbox.stub(UserRepository.prototype, 'findCommon').resolves([list, 10]);

        const result = await userBusiness.findCommon(new UserCommonFilterRequest());
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find common users with permission', async () => {
        sandbox.stub(UserRepository.prototype, 'findCommon').resolves([list, 10]);
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 1;

        const result = await userBusiness.findCommon(new UserCommonFilterRequest(), userAuth);
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find common users with name or email', async () => {
        sandbox.stub(UserRepository.prototype, 'findCommon').resolves([list, 10]);

        const filter = new UserCommonFilterRequest();
        filter.keyword = 'localhost';

        const result = await userBusiness.findCommon(filter);
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Get user by id and limit permisison', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(item);
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 2;

        const data = await userBusiness.getById(item.id, userAuth);
        expect(data).to.eq(undefined);
    });

    it('Get user by id', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(item);

        const result = await userBusiness.getById(item.id);
        expect(result && result.id === item.id).to.eq(true);
    });

    it('Create user without role id', async () => {
        const userCreate = generateUserCreate();
        delete userCreate.roleId;

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'role id').message);
        });
    });

    it('Create user with an invalid role id', async () => {
        const userCreate = generateUserCreate();
        userCreate.roleId = 0;

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'role id').message);
        });
    });

    it('Create user without first name', async () => {
        const userCreate = generateUserCreate();
        userCreate.firstName = '';

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'first name').message);
        });
    });

    it('Create user with an invalid first name', async () => {
        const userCreate = generateUserCreate();
        userCreate.firstName = 123 as any;

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'first name').message);
        });
    });

    it('Create user with first name length greater than 20 characters', async () => {
        const userCreate = generateUserCreate();
        userCreate.firstName = 'This is the first name with length greater than 20 characters!';

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'first name', 20).message);
        });
    });

    it('Create user with an invalid last name', async () => {
        const userCreate = generateUserCreate();
        userCreate.lastName = 123 as any;

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'last name').message);
        });
    });

    it('Create user with last name length greater than 20 characters', async () => {
        const userCreate = generateUserCreate();
        userCreate.lastName = 'This is the last name with length greater than 20 characters!';

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'last name', 20).message);
        });
    });

    it('Create user without email', async () => {
        const userCreate = generateUserCreate();
        userCreate.email = '';

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'email').message);
        });
    });

    it('Create user with email is not string', async () => {
        const userCreate = generateUserCreate();
        userCreate.email = 123 as any;

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'email').message);
        });
    });

    it('Create user with an invalid email', async () => {
        const userCreate = generateUserCreate();
        userCreate.email = 'test@';

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'email').message);
        });
    });

    it('Create user with email length greater than 120 characters', async () => {
        const userCreate = generateUserCreate();
        userCreate.email = 'test.localhost.test.localhost.test.localhost.localhost.localhost@test-asdfaasdfasfdgsgdsfasdfaasdfasfdgsgdsf-localhost.com';

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'email', 120).message);
        });
    });

    it('Create user without password', async () => {
        const userCreate = generateUserCreate();
        userCreate.password = '';

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'password').message);
        });
    });

    it('Create user with password is not string', async () => {
        const userCreate = generateUserCreate();
        userCreate.password = 123 as any;

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'password').message);
        });
    });

    it('Create user with password length greater than 20 characters', async () => {
        const userCreate = generateUserCreate();
        userCreate.password = 'This is the password with length greater than 20 characters!';

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'password', 20).message);
        });
    });

    it('Create user with password is not secure', async () => {
        const userCreate = generateUserCreate();
        userCreate.password = '123456';

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3002, 'password', 6, 20).message);
        });
    });

    it('Create user with an invalid gender', async () => {
        const userCreate = generateUserCreate();
        userCreate.gender = 3;

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'gender').message);
        });
    });

    it('Create user with an invalid birthday', async () => {
        const userCreate = generateUserCreate();
        userCreate.birthday = 123 as any;

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'birthday').message);
        });
    });

    it('Create user with birthday greater than current time', async () => {
        const userCreate = generateUserCreate();
        userCreate.birthday!.setDate(userCreate.birthday!.getDate() + 1);

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'birthday').message);
        });
    });

    it('Create user with an invalid phone', async () => {
        const userCreate = generateUserCreate();
        userCreate.phone = 123 as any;

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'phone').message);
        });
    });

    it('Create user with phone length greater than 20 characters', async () => {
        const userCreate = generateUserCreate();
        userCreate.phone = 'This is the phone number with length greater than 20 characters!';

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'phone', 20).message);
        });
    });

    it('Create user with an invalid address', async () => {
        const userCreate = generateUserCreate();
        userCreate.address = 123 as any;

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'address').message);
        });
    });

    it('Create user with address length greater than 200 characters', async () => {
        const userCreate = generateUserCreate();
        userCreate.address = 'This is the address with length greater than 200 characters!';
        while (userCreate.address.length <= 200) userCreate.address += userCreate.address;

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'address', 200).message);
        });
    });

    it('Create user with an invalid culture', async () => {
        const userCreate = generateUserCreate();
        userCreate.culture = 123 as any;

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'culture').message);
        });
    });

    it('Create user with culture length not be 5 characters', async () => {
        const userCreate = generateUserCreate();
        userCreate.culture = 'This is the culture with length not be 5 characters!';

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2001, 'culture', 5).message);
        });
    });

    it('Create user with an invalid currency', async () => {
        const userCreate = generateUserCreate();
        userCreate.currency = 123 as any;

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'currency').message);
        });
    });

    it('Create user with currency length not be 3 characters', async () => {
        const userCreate = generateUserCreate();
        userCreate.currency = 'This is the currency with length not be 3 characters!';

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2001, 'currency', 3).message);
        });
    });

    it('Create user with email has exists', async () => {
        sandbox.stub(UserRepository.prototype, 'checkEmailExist').resolves(true);
        const userCreate = generateUserCreate();

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1005, 'email').message);
        });
    });

    it('Create user with role is not exists', async () => {
        sandbox.stub(UserRepository.prototype, 'checkEmailExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(undefined);
        const userCreate = generateUserCreate();

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'role').message);
        });
    });

    it('Create user with access denied', async () => {
        const role = generateRole();
        const userCreate = generateUserCreate();
        sandbox.stub(UserRepository.prototype, 'checkEmailExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(role);
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 2;

        await userBusiness.create(userCreate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3).message);
        });
    });

    it('Create user with cannot save error', async () => {
        const role = generateRole();
        const userCreate = generateUserCreate();
        sandbox.stub(UserRepository.prototype, 'checkEmailExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(role);
        sandbox.stub(UserRepository.prototype, 'create').resolves();

        await userBusiness.create(userCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(5).message);
        });
    });

    it('Create user successfully', async () => {
        const user = list[0];
        const role = generateRole();
        const userCreate = generateUserCreate();
        sandbox.stub(UserRepository.prototype, 'checkEmailExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(role);
        sandbox.stub(UserRepository.prototype, 'create').resolves(user.id);
        sandbox.stub(UserRepository.prototype, 'getById').resolves(user);

        const result = await userBusiness.create(userCreate);
        expect(result && result.id === user.id).to.eq(true);
    });

    it('Update user with id not exists', async () => {
        sandbox.stub(UserRepository.prototype, 'getById').resolves(undefined);

        const userUpdate = generateUserUpdate();
        await userBusiness.update(10, userUpdate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1004, 'user').message);
        });
    });

    it('Update user with access denied', async () => {
        const user = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(user);

        const userUpdate = generateUserUpdate();
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 2;

        await userBusiness.update(user.id, userUpdate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3).message);
        });
    });

    it('Update user without first name', async () => {
        const user = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(user);

        const userUpdate = generateUserUpdate();
        userUpdate.firstName = '';

        await userBusiness.update(user.id, userUpdate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'first name').message);
        });
    });

    it('Update user with cannot save error', async () => {
        const user = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(user);
        sandbox.stub(UserRepository.prototype, 'update').resolves(false);

        const userUpdate = generateUserUpdate();
        await userBusiness.update(user.id, userUpdate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(5).message);
        });
    });

    it('Update user successfully', async () => {
        const user = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(user);
        sandbox.stub(UserRepository.prototype, 'update').resolves(true);

        const userUpdate = generateUserUpdate();
        const result = await userBusiness.update(user.id, userUpdate);
        expect(result && result.id === user.id).to.eq(true);
    });

    it('Update password with id is not exists', async () => {
        sandbox.stub(UserRepository.prototype, 'getById').resolves(undefined);
        const userPassword = new UserPasswordUpdateRequest();

        await userBusiness.updatePassword(10, userPassword).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1003, 'password').message);
        });
    });

    it('Update password with wrong old password', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(item);
        item.password = 'Nodecore@2';

        const userPassword = new UserPasswordUpdateRequest();
        userPassword.password = '12345';
        userPassword.newPassword = 'Nodecore@2';

        await userBusiness.updatePassword(item.id, userPassword).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1003, 'password').message);
        });
    });

    it('Update password with access denied', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(item);
        item.password = 'Nodecore@2';

        const userPassword = new UserPasswordUpdateRequest();
        userPassword.password = 'Nodecore@2';
        userPassword.newPassword = 'Nodecore@2';

        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 2;

        await userBusiness.updatePassword(item.id, userPassword, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3).message);
        });
    });

    it('Update password successfully', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(item);
        sandbox.stub(UserRepository.prototype, 'update').resolves(true);
        item.password = 'Nodecore@2';

        const userPassword = new UserPasswordUpdateRequest();
        userPassword.password = 'Nodecore@2';
        userPassword.newPassword = 'Nodecore@2';

        const result = await userBusiness.updatePassword(item.id, userPassword);
        expect(result).to.eq(true);
    });

    it('Upload avatar with id not exists', async () => {
        sandbox.stub(UserRepository.prototype, 'getById').resolves(undefined);

        const filePath = path.join(__dirname, '../resources/images/workplace.jpg');
        const buffer = await readFile(filePath);

        await userBusiness.uploadAvatar(10, buffer).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1004, 'user').message);
        });
    });

    it('Upload avatar without image buffer', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(item);

        await userBusiness.uploadAvatar(1, undefined as any).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError().message);
        });
    });

    it('Upload avatar with format not supported', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(item);

        const filePath = path.join(__dirname, '../resources/images/workplace.tiff');
        const buffer = await readFile(filePath);

        await userBusiness.uploadAvatar(1, buffer).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2006, 'image', 'JPEG (.jpeg/.jpg), GIF (.gif), PNG (.png)').message);
        });
    });

    it('Upload avatar with large size', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(item);

        const filePath = path.join(__dirname, '../resources/images/test-large-size.png');
        const buffer = await readFile(filePath);

        await userBusiness.uploadAvatar(1, buffer).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3005, 'image', User.getMaxAvatarSize() / 1024, 'KB').message);
        });
    });

    it('Upload avatar with access denied', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(item);

        const filePath = path.join(__dirname, '../resources/images/workplace.jpg');
        const buffer = await readFile(filePath);

        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 2;

        await userBusiness.uploadAvatar(10, buffer, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3).message);
        });
    });

    it('Upload avatar with value type is not a string', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(item);
        sandbox.stub(StorageService.prototype, 'upload').resolves(1 as any);

        const filePath = path.join(__dirname, '../resources/images/workplace.jpg');
        const buffer = await readFile(filePath);

        await userBusiness.uploadAvatar(10, buffer).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'avatar').message);
        });
    });

    it('Upload avatar with url length greater than 200 characters', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(item);
        let url = '/path/file.png';
        while (url.length <= 200) url += url;
        sandbox.stub(StorageService.prototype, 'upload').resolves(url);

        const filePath = path.join(__dirname, '../resources/images/workplace.jpg');
        const buffer = await readFile(filePath);

        await userBusiness.uploadAvatar(10, buffer).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'avatar', 200).message);
        });
    });

    it('Upload avatar successfully', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(item);
        sandbox.stub(StorageService.prototype, 'upload').resolves('/path/file.png');
        sandbox.stub(UserRepository.prototype, 'update').resolves(true);
        sandbox.stub(StorageService.prototype, 'mapUrl').resolves('/path/file.png');

        const filePath = path.join(__dirname, '../resources/images/workplace.jpg');
        const buffer = await readFile(filePath);

        const result = await userBusiness.uploadAvatar(item.id, buffer);
        expect(result).to.eq('/path/file.png');
    });

    it('Delete user with id not exists', async () => {
        sandbox.stub(UserRepository.prototype, 'getById').resolves(undefined);

        await userBusiness.delete(10).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1004, 'user').message);
        });
    });

    it('Delete user with access denied', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(item);

        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 2;

        await userBusiness.delete(item.id, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3).message);
        });
    });

    it('Delete user successfully', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getById').resolves(item);
        sandbox.stub(UserRepository.prototype, 'delete').resolves(true);

        const result = await userBusiness.delete(item.id);
        expect(result).to.eq(true);
    });

    it('Create data sample successfully', async () => {
        const role = generateRole();
        const user = list[0];
        sandbox.stub(RoleRepository.prototype, 'getAll').resolves([role]);
        sandbox.stub(UserRepository.prototype, 'getByEmail').resolves(undefined);
        sandbox.stub(UserRepository.prototype, 'create').resolves(user.id);
        sandbox.stub(UserRepository.prototype, 'getById').resolves(user);
        sandbox.stub(StorageService.prototype, 'upload').resolves('/path/file.png');
        sandbox.stub(UserRepository.prototype, 'update').resolves(true);

        const bulkAction = new BulkActionResponse(sampleList.length);
        for (let i = 0; i < sampleList.length; i++)
            bulkAction.success();

        const result = await userBusiness.createSampleData();
        expect(result.total === bulkAction.total && result.successes === bulkAction.successes).to.eq(true);
    });

    it('Create data sample successfully with all items have ignored by role is not matched', async () => {
        const role = new Role({ id: 1000, createdAt: new Date(), updatedAt: new Date(), name: 'Role 1000', level: 1000 } as IRole);
        sandbox.stub(RoleRepository.prototype, 'getAll').resolves([role]);

        const bulkAction = new BulkActionResponse(sampleList.length);
        for (let i = 0; i < sampleList.length; i++)
            bulkAction.ignore();

        const result = await userBusiness.createSampleData();
        expect(result.total === bulkAction.total && result.ignores === bulkAction.ignores).to.eq(true);
    });

    it('Create data sample successfully with an item have email already', async () => {
        const role = generateRole();
        const user = list[0];
        sandbox.stub(RoleRepository.prototype, 'getAll').resolves([role]);
        sandbox.stub(UserRepository.prototype, 'getByEmail').resolves(undefined).onFirstCall().resolves(user);
        sandbox.stub(UserRepository.prototype, 'create').resolves(user.id);
        sandbox.stub(UserRepository.prototype, 'getById').resolves(user);
        sandbox.stub(StorageService.prototype, 'upload').resolves('/path/file.png');
        sandbox.stub(UserRepository.prototype, 'update').resolves(true);

        const bulkAction = new BulkActionResponse(sampleList.length);
        for (let i = 0; i < sampleList.length; i++) {
            if (i === 0)
                bulkAction.ignore();
            else
                bulkAction.success();
        }

        const result = await userBusiness.createSampleData();
        expect(result.total === bulkAction.total && result.ignores === bulkAction.ignores).to.eq(true);
    });

    it('Create data sample successfully with 2 items have failed', async () => {
        const role = generateRole();
        const user = list[0];
        sandbox.stub(RoleRepository.prototype, 'getAll').resolves([role]);
        sandbox.stub(UserRepository.prototype, 'getByEmail').resolves(undefined);
        sandbox.stub(UserRepository.prototype, 'create').resolves(user.id).onFirstCall().rejects().onSecondCall().rejects();
        sandbox.stub(UserRepository.prototype, 'getById').resolves(user);
        sandbox.stub(StorageService.prototype, 'upload').resolves('/path/file.png');
        sandbox.stub(UserRepository.prototype, 'update').resolves(true);

        const bulkAction = new BulkActionResponse(sampleList.length);
        for (let i = 0; i < sampleList.length; i++) {
            if (i <= 1)
                bulkAction.fail(i);
            else
                bulkAction.success();
        }

        const result = await userBusiness.createSampleData();
        expect(result.total === bulkAction.total && result.successes === bulkAction.successes && result.failures === bulkAction.failures).to.eq(true);
    });
});
