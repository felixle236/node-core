import * as mime from 'mime-types';
import { Inject, Service } from 'typedi';
import { BulkActionResult } from '../../../../domain/common/usecase/BulkActionResult';
import { CreateDummyUserCommand } from './CreateDummyUserCommand';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { IDbContext } from '../../../../domain/common/database/interfaces/IDbContext';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';
import { IStorageService } from '../../../../gateways/services/IStorageService';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/user/User';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { readFile } from '../../../../../libs/file';

@Service()
export class CreateDummyUserCommandHandler implements ICommandHandler<CreateDummyUserCommand, BulkActionResult> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

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
                        const data = new User();
                        data.roleId = item.roleId;
                        data.status = UserStatus.ACTIVED;
                        data.firstName = item.firstName;
                        data.lastName = item.lastName;
                        data.email = item.email;
                        data.password = item.password;
                        data.gender = item.gender;

                        const id = await this._userRepository.create(data, queryRunner);
                        if (id && item.avatar) {
                            const buffer = await readFile(item.avatar);
                            const mimetype = mime.lookup(item.avatar) || '';
                            const ext = mime.extension(mimetype);

                            if (!ext)
                                throw new SystemError(MessageError.PARAM_INVALID, 'avatar');

                            User.validateAvatarFile({
                                mimetype,
                                buffer,
                                size: buffer.length
                            } as Express.Multer.File);

                            const avatarPath = User.getAvatarPath(id, ext);
                            const data = new User();
                            data.avatar = avatarPath;
                            await this._storageService.upload(avatarPath, buffer, mimetype);
                            await this._userRepository.update(id, data, queryRunner);
                        }
                    }
                }, async () => {
                    bulkAction.fail(index);
                }, async () => {
                    bulkAction.success();
                }).catch(err => console.log(err));
            }
        }
        return bulkAction;
    }
}
