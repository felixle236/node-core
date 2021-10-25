import { STORAGE_UPLOAD_DIR } from '@configs/Configuration';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { UploadMyAvatarHandler } from '@usecases/user/user/upload-my-avatar/UploadMyAvatarHandler';
import { UploadMyAvatarInput } from '@usecases/user/user/upload-my-avatar/UploadMyAvatarInput';
import { UploadMyAvatarOutput } from '@usecases/user/user/upload-my-avatar/UploadMyAvatarOutput';
import multer from 'multer';
import { Authorized, CurrentUser, JsonController, Post, UploadedFile } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
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
    async uploadMyAvatar(@UploadedFile('avatar', { required: true, options: { storage } }) file: Express.Multer.File, @CurrentUser() userAuth: UserAuthenticated): Promise<UploadMyAvatarOutput> {
        const param = new UploadMyAvatarInput();
        param.file = file;
        return await this._uploadMyAvatarHandler.handle(userAuth.userId, param);
    }
}
