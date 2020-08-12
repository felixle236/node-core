import * as fileType from 'file-type';
import * as path from 'path';
import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { BUCKET_NAME } from '../../../constants/Environments';
import { BulkAction } from '../../domain/common/output/BulkAction';
import { IMailService } from '../interfaces/services/IMailService';
import { IRoleRepository } from '../interfaces/data/IRoleRepository';
import { IStorageService } from '../interfaces/services/IStorageService';
import { IUserInteractor } from '../interfaces/interactors/IUserInteractor';
import { IUserRepository } from '../interfaces/data/IUserRepository';
import { ResultList } from '../../domain/common/output/ResultList';
import { RoleId } from '../../domain/enums/RoleId';
import { SystemError } from '../../dtos/common/Exception';
import { User } from '../../domain/entities/User';
import { UserAuthenticated } from '../../dtos/common/UserAuthenticated';
import { UserStatus } from '../../domain/enums/UserStatus';
import { getConnection } from 'typeorm';
import { readFile } from '../../../libs/file';

@Service('user.interactor')
export class UserInteractor implements IUserInteractor {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    async active(activeKey: string): Promise<boolean> {
        if (!activeKey)
            throw new SystemError();

        const user = await this._userRepository.getByActiveKey(activeKey);
        if (!user)
            throw new SystemError(1004, 'activation key');
        if (user.status === UserStatus.ACTIVED)
            throw new SystemError();
        if (!user.activeKey || !user.activeExpire || user.activeExpire < new Date())
            throw new SystemError(1008, 'activation key');

        user.active();
        const updateData = user.toActiveData();
        return await this._userRepository.update(user.id, updateData);
    }

    async resendActivation(email: string): Promise<boolean> {
        if (!validator.isEmail(email))
            throw new SystemError(1002, 'email');

        const user = await this._userRepository.getByEmail(email);
        if (!user || user.status === UserStatus.ACTIVED)
            throw new SystemError();

        user.createActiveKey();
        const updateData = user.toActiveData();
        const hasSucceed = await this._userRepository.update(user.id, updateData);
        await this._mailService.resendUserActivation(user);
        return hasSucceed;
    }

    async forgotPassword(email: string): Promise<boolean> {
        if (!validator.isEmail(email))
            throw new SystemError(1002, 'email');

        const user = await this._userRepository.getByEmail(email);
        if (!user || user.status !== UserStatus.ACTIVED)
            throw new SystemError();

        user.createForgotKey();
        const updateData = user.toForgotData();
        const hasSucceed = await this._userRepository.update(user.id, updateData);
        await this._mailService.sendForgotPassword(user);
        return hasSucceed;
    }

    async resetPassword(forgotKey: string, password: string): Promise<boolean> {
        if (!forgotKey || !password)
            throw new SystemError();

        const user = await this._userRepository.getByForgotKey(forgotKey);
        if (!user)
            throw new SystemError(1004, 'forgot key');
        if (user.status !== UserStatus.ACTIVED)
            throw new SystemError();
        if (!user.forgotKey || !user.forgotExpire || user.forgotExpire < new Date())
            throw new SystemError(1008, 'forgot key');

        user.resetPassword(password);
        const updateData = user.toResetPasswordData();
        return await this._userRepository.update(user.id, updateData);
    }

    async archive(id: number, userAuth: UserAuthenticated): Promise<boolean> {
        const user = await this._userRepository.getById(id);
        if (!user)
            throw new SystemError(1004, 'user');

        if (!user.role || user.role.level <= userAuth.role.level)
            throw new SystemError(3);

        user.archive();
        const updateData = user.toArchiveData();
        return await this._userRepository.update(id, updateData);
    }

    async createSampleData(): Promise<BulkAction> {
        const users = require('../../resources/sample-data/users.json');
        const bulkAction = new BulkAction(users.length);
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
                        user.status = UserStatus.ACTIVED;
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

                        const createUser = user.toCreateData();
                        const id = await this._userRepository.create(createUser, queryRunner);
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

                                const updateData = user.toUpdateData();
                                await this._userRepository.update(id, updateData, queryRunner);
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
