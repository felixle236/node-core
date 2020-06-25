import * as fileType from 'file-type';
import * as path from 'path';
import { Inject, Service } from 'typedi';
import { mapModel, mapModels } from '../../libs/common';
import { BUCKET_NAME } from '../../constants/Environments';
import { BulkActionResponse } from '../dtos/common/BulkActionResponse';
import { IRoleRepository } from '../interfaces/gateways/data/IRoleRepository';
import { IStorageService } from '../interfaces/gateways/medias/IStorageService';
import { IUserBusiness } from '../interfaces/businesses/IUserBusiness';
import { IUserRepository } from '../interfaces/gateways/data/IUserRepository';
import { ResultListResponse } from '../dtos/common/ResultListResponse';
import { SystemError } from '../dtos/common/Exception';
import { User } from '../models/User';
import { UserAuthenticated } from '../dtos/user/UserAuthenticated';
import { UserCommonFilterRequest } from '../dtos/user/requests/UserCommonFilterRequest';
import { UserCommonResponse } from '../dtos/user/responses/UserCommonResponse';
import { UserCreateRequest } from '../dtos/user/requests/UserCreateRequest';
import { UserFilterRequest } from '../dtos/user/requests/UserFilterRequest';
import { UserPasswordUpdateRequest } from '../dtos/user/requests/UserPasswordUpdateRequest';
import { UserResponse } from '../dtos/user/responses/UserResponse';
import { UserUpdateRequest } from '../dtos/user/requests/UserUpdateRequest';
import { getConnection } from 'typeorm';
import { readFile } from '../../libs/file';

@Service('user.business')
export class UserBusiness implements IUserBusiness {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    async find(filter: UserFilterRequest, userAuth?: UserAuthenticated): Promise<ResultListResponse<UserResponse>> {
        filter.level = userAuth && userAuth.role.level;
        const [list, count] = await this._userRepository.find(filter);
        return filter.toResultList(mapModels(UserResponse, list), count);
    }

    async findCommon(filter: UserCommonFilterRequest, userAuth?: UserAuthenticated): Promise<ResultListResponse<UserCommonResponse>> {
        filter.level = userAuth && userAuth.role.level;
        const [list, count] = await this._userRepository.findCommon(filter);
        return filter.toResultList(mapModels(UserCommonResponse, list), count);
    }

    async getById(id: number, userAuth?: UserAuthenticated): Promise<UserResponse | undefined> {
        const user = await this._userRepository.getById(id);
        if (user && userAuth && user.role && user.role.level <= userAuth.role.level)
            return;
        return mapModel(UserResponse, user);
    }

    async create(data: UserCreateRequest, userAuth?: UserAuthenticated): Promise<UserResponse | undefined> {
        const user = new User();
        user.roleId = data.roleId;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.password = data.password;
        user.gender = data.gender;
        user.birthday = data.birthday;
        user.phone = data.phone;
        user.address = data.address;
        user.culture = data.culture;
        user.currency = data.currency;
        user.activedAt = new Date();

        if (await this._userRepository.checkEmailExist(user.email))
            throw new SystemError(1005, 'email');

        const role = await this._roleRepository.getById(user.roleId);
        if (!role)
            throw new SystemError(1002, 'role');

        if (userAuth && role.level <= userAuth.role.level)
            throw new SystemError(3);

        const id = await this._userRepository.create(user);
        if (!id)
            throw new SystemError(5);

        const newData = await this._userRepository.getById(id);
        return mapModel(UserResponse, newData);
    }

    async update(id: number, data: UserUpdateRequest, userAuth?: UserAuthenticated): Promise<UserResponse | undefined> {
        const user = await this._userRepository.getById(id);
        if (!user)
            throw new SystemError(1004, 'user');

        if (userAuth && user.role && user.role.level <= userAuth.role.level)
            throw new SystemError(3);

        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.gender = data.gender;
        user.birthday = data.birthday;
        user.phone = data.phone;
        user.address = data.address;
        user.currency = data.currency;
        user.culture = data.culture;

        const hasSucceed = await this._userRepository.update(id, user);
        if (!hasSucceed)
            throw new SystemError(5);

        const newData = await this._userRepository.getById(id);
        return mapModel(UserResponse, newData);
    }

    async updatePassword(id: number, data: UserPasswordUpdateRequest, userAuth?: UserAuthenticated): Promise<boolean> {
        const user = await this._userRepository.getById(id);
        if (!user || user.password !== user.hashPassword(data.password))
            throw new SystemError(1003, 'password');

        if (userAuth && user.role && user.role.level <= userAuth.role.level)
            throw new SystemError(3);

        user.password = data.newPassword;
        return await this._userRepository.update(id, user);
    }

    async uploadAvatar(id: number, buffer: Buffer, userAuth?: UserAuthenticated): Promise<string> {
        const user = await this._userRepository.getById(id);
        if (!user)
            throw new SystemError(1004, 'user');

        if (!buffer)
            throw new SystemError();

        const type = await fileType.fromBuffer(buffer);
        const extension = type ? type.ext : '';

        user.validateAvatarFormat(extension);
        user.validateAvatarSize(buffer.length);

        if (userAuth && user.role && user.role.level <= userAuth.role.level)
            throw new SystemError(3);

        const avatarPath = user.getAvatarPath(extension);
        const url = await this._storageService.upload(BUCKET_NAME, avatarPath, buffer);
        user.avatar = url;

        await this._userRepository.update(id, user);
        return this._storageService.mapUrl(url);
    }

    async delete(id: number, userAuth?: UserAuthenticated): Promise<boolean> {
        const user = await this._userRepository.getById(id);
        if (!user)
            throw new SystemError(1004, 'user');

        if (userAuth && user.role && user.role.level <= userAuth.role.level)
            throw new SystemError(3);

        return await this._userRepository.delete(id);
    }

    async createSampleData(): Promise<BulkActionResponse> {
        const users = require('../../resources/sample-data/users.json');
        const bulkAction = new BulkActionResponse(users.length);
        const roles = await this._roleRepository.getAll();

        for (let index = 0; index < users.length; index++) {
            const item = users[index];
            const role = roles.find(role => role.id === item.roleId);
            if (!role)
                bulkAction.ignore();
            else {
                await getConnection().transaction(async entityManager => {
                    const queryRunner = entityManager.connection.createQueryRunner();
                    let user = await this._userRepository.getByEmail(item.email, queryRunner);
                    if (user)
                        bulkAction.ignore();
                    else {
                        user = new User();
                        user.roleId = item.roleId;
                        user.firstName = item.firstName;
                        user.lastName = item.lastName;
                        user.email = item.email;
                        user.password = item.password;
                        user.gender = item.gender;
                        user.birthday = item.birthday;
                        user.phone = item.phone;
                        user.address = item.address;
                        user.culture = item.culture;
                        user.currency = item.currency;
                        user.activedAt = new Date();

                        const id = await this._userRepository.create(user, queryRunner);
                        if (id && item.avatar) {
                            user = await this._userRepository.getById(id, queryRunner);
                            if (user) {
                                const filePath = path.join(__dirname, item.avatar);
                                const buffer = await readFile(filePath);
                                const type = await fileType.fromBuffer(buffer);
                                const extension = type ? type.ext : '';

                                user.validateAvatarFormat(extension);
                                user.validateAvatarSize(buffer.length);

                                const avatarPath = user.getAvatarPath(extension);
                                const url = await this._storageService.upload(BUCKET_NAME, avatarPath, buffer);
                                user.avatar = url;

                                await this._userRepository.update(id, user, queryRunner);
                            }
                        }
                        bulkAction.success();
                    }
                }).catch(() => {
                    bulkAction.fail(index);
                });
            }
        }
        return bulkAction;
    }
}
