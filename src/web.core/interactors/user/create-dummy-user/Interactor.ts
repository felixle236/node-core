import * as fileType from 'file-type';
import * as path from 'path';
import { Inject, Service } from 'typedi';
import { BulkActionResult } from '../../../domain/common/outputs/BulkActionResult';
import { CreateDummyUserInput } from './Input';
import { IDbContext } from '../../../domain/common/persistence/IDbContext';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IRoleRepository } from '../../../gateways/repositories/IRoleRepository';
import { IStorageService } from '../../../gateways/services/IStorageService';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserStatus } from '../../../domain/enums/UserStatus';
import { readFile } from '../../../../libs/file';

@Service()
export class CreateDummyUserInteractor implements IInteractor<CreateDummyUserInput, BulkActionResult> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    async handle(param: CreateDummyUserInput): Promise<BulkActionResult> {
        const bulkAction = new BulkActionResult(param.users.length);
        const roles = await this._roleRepository.getAll();

        for (let index = 0; index < param.users.length; index++) {
            const item = param.users[index];
            const role = roles.find(role => role.id === item.roleId);
            if (!role)
                bulkAction.ignore();
            else {
                await this._dbContext.getConnection().runTransaction(async queryRunner => {
                    let user = await this._userRepository.getByEmail(item.email, queryRunner);
                    if (user)
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
                            user = await this._userRepository.getById(id, queryRunner);
                            if (user) {
                                const filePath = path.join(__dirname, item.avatar);
                                const buffer = await readFile(filePath);
                                const type = await fileType.fromBuffer(buffer);
                                const extension = type ? type.ext : '';

                                user.validateAvatarFormat(extension);
                                user.validateAvatarSize(buffer.length);

                                const avatarPath = user.getAvatarPath(extension);
                                const urlPath = await this._storageService.upload(avatarPath, buffer);

                                const data = new User();
                                data.avatar = urlPath;

                                await this._userRepository.update(id, data, queryRunner);
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
