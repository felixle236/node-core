import * as mime from 'mime-types';
import { Inject, Service } from 'typedi';
import { v4 } from 'uuid';
import { CreateDummyUserCommand } from './CreateDummyUserCommand';
import { readFile } from '../../../../../libs/file';
import { IDbContext } from '../../../../domain/common/database/interfaces/IDbContext';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { BulkActionResult } from '../../../../domain/common/usecase/BulkActionResult';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Auth } from '../../../../domain/entities/auth/Auth';
import { User } from '../../../../domain/entities/user/User';
import { AuthType } from '../../../../domain/enums/auth/AuthType';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IUser } from '../../../../domain/types/user/IUser';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { ILogService } from '../../../../gateways/services/ILogService';
import { IStorageService } from '../../../../gateways/services/IStorageService';

@Service()
export class CreateDummyUserCommandHandler implements ICommandHandler<CreateDummyUserCommand, BulkActionResult> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    @Inject('log.service')
    private readonly _logService: ILogService;

    async handle(param: CreateDummyUserCommand): Promise<BulkActionResult> {
        const bulkAction = new BulkActionResult(param.users.length);
        const roles = await this._roleRepository.getAll();

        for (let index = 0; index < param.users.length; index++) {
            const item = param.users[index];
            const role = roles.find(role => role.id === item.roleId);
            if (!role)
                bulkAction.ignore();
            else {
                await this._dbContext.getConnection().runTransaction(async queryRunner => {
                    const isExist = await this._userRepository.checkEmailExist(item.email);
                    if (isExist)
                        bulkAction.ignore();
                    else {
                        const user = new User({ id: v4() } as IUser);
                        user.roleId = item.roleId;
                        user.status = UserStatus.ACTIVED;
                        user.firstName = item.firstName;
                        user.lastName = item.lastName;
                        user.email = item.email;
                        user.gender = item.gender;

                        const auth = new Auth();
                        auth.userId = user.id;
                        auth.type = AuthType.PERSONAL_EMAIL;
                        auth.username = item.email;
                        auth.password = item.password;

                        await this._userRepository.create(user, queryRunner);
                        await this._authRepository.create(auth, queryRunner);

                        if (item.avatar) {
                            const buffer = await readFile(item.avatar);
                            const mimetype = mime.lookup(item.avatar) || '';
                            const ext = mime.extension(mimetype);
                            if (!ext)
                                throw new SystemError(MessageError.PARAM_INVALID, 'avatar');

                            User.validateAvatarFile({
                                mimetype,
                                size: buffer.length
                            } as Express.Multer.File);

                            const avatarPath = User.getAvatarPath(user.id, ext);
                            const data = new User();
                            data.avatar = avatarPath;
                            await this._storageService.upload(avatarPath, buffer, mimetype);
                            await this._userRepository.update(user.id, data, queryRunner);
                        }
                    }
                }, async () => {
                    bulkAction.fail(index);
                }, async () => {
                    bulkAction.success();
                }).catch(err => this._logService.error(err));
            }
        }
        return bulkAction;
    }
}
