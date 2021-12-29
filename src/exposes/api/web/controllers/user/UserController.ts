import { RoleId } from 'domain/enums/user/RoleId';
import { ImportClientTestHandler } from 'application/usecases/user/client/import-client-test/ImportClientTestHandler';
import { ImportManagerTestHandler } from 'application/usecases/user/manager/import-manager-test/ImportManagerTestHandler';
import { GetListOnlineStatusByIdsHandler } from 'application/usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsHandler';
import { GetListOnlineStatusByIdsInput } from 'application/usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsInput';
import { GetListOnlineStatusByIdsOutput } from 'application/usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsOutput';
import { UploadAvatarHandler } from 'application/usecases/user/user/upload-avatar/UploadAvatarHandler';
import { UploadAvatarInput } from 'application/usecases/user/user/upload-avatar/UploadAvatarInput';
import { UploadAvatarOutput } from 'application/usecases/user/user/upload-avatar/UploadAvatarOutput';
import { STORAGE_UPLOAD_DIR } from 'config/Configuration';
import { PrivateAccessMiddleware } from 'exposes/api/web/middlewares/PrivateAccessMiddleware';
import multer from 'multer';
import { Authorized, Get, JsonController, Post, QueryParams, UseBefore, UploadedFile, CurrentUser } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { Service } from 'typedi';

const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, STORAGE_UPLOAD_DIR);
    },
    filename(_req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}`);
    }
});

@Service()
@JsonController('/v1/users')
export class UserController {
    constructor(
        private readonly _uploadAvatarHandler: UploadAvatarHandler,
        private readonly _getListOnlineStatusByIdsHandler: GetListOnlineStatusByIdsHandler,
        private readonly _importManagerTestHandler: ImportManagerTestHandler,
        private readonly _importClientTestHandler: ImportClientTestHandler
    ) {}

    @Post('/avatar')
    @Authorized()
    @OpenAPI({ summary: 'Upload avatar' })
    @ResponseSchema(UploadAvatarOutput)
    uploadAvatar(@UploadedFile('avatar', { required: true, options: { storage } }) file: Express.Multer.File, @CurrentUser() userAuth: UserAuthenticated): Promise<UploadAvatarOutput> {
        const param = new UploadAvatarInput();
        param.file = file;
        return this._uploadAvatarHandler.handle(userAuth.userId, param);
    }

    @Get('/list-online-status')
    @Authorized()
    @ResponseSchema(GetListOnlineStatusByIdsOutput)
    getListOnlineStatusByIds(@QueryParams() param: GetListOnlineStatusByIdsInput): Promise<GetListOnlineStatusByIdsOutput> {
        return this._getListOnlineStatusByIdsHandler.handle(param);
    }

    @Get('/api-private')
    @UseBefore(PrivateAccessMiddleware)
    testApiPrivate(): Promise<{data: boolean}> {
        return Promise.resolve({ data: true });
    }

    @Post('/import-user-test')
    @Authorized(RoleId.SuperAdmin)
    async importUserTest(): Promise<{data: boolean}> {
        await this._importManagerTestHandler.handle();
        await this._importClientTestHandler.handle();
        return { data: true };
    }
}
