import { UploadMyAvatarHandler } from 'application/usecases/user/user/upload-my-avatar/UploadMyAvatarHandler';
import { UploadMyAvatarInput } from 'application/usecases/user/user/upload-my-avatar/UploadMyAvatarInput';
import { UploadMyAvatarOutput } from 'application/usecases/user/user/upload-my-avatar/UploadMyAvatarOutput';
import { STORAGE_UPLOAD_DIR } from 'config/Configuration';
import multer from 'multer';
import { Authorized, CurrentUser, JsonController, Post, UploadedFile } from 'routing-controllers';
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
@JsonController('/v1/me')
export class MeController {
    constructor(
        private readonly _uploadMyAvatarHandler: UploadMyAvatarHandler
    ) {}

    @Post('/avatar')
    @Authorized()
    @OpenAPI({ summary: 'Upload my avatar' })
    @ResponseSchema(UploadMyAvatarOutput)
    uploadMyAvatar(@UploadedFile('avatar', { required: true, options: { storage } }) file: Express.Multer.File, @CurrentUser() userAuth: UserAuthenticated): Promise<UploadMyAvatarOutput> {
        const param = new UploadMyAvatarInput();
        param.file = file;
        return this._uploadMyAvatarHandler.handle(userAuth.userId, param);
    }
}
