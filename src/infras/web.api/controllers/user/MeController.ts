import { STORAGE_UPLOAD_DIR } from '@configs/Configuration';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { UploadMyAvatarCommandHandler } from '@usecases/user/user/commands/upload-my-avatar/UploadMyAvatarCommandHandler';
import { UploadMyAvatarCommandInput } from '@usecases/user/user/commands/upload-my-avatar/UploadMyAvatarCommandInput';
import { UploadMyAvatarCommandOutput } from '@usecases/user/user/commands/upload-my-avatar/UploadMyAvatarCommandOutput';
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
        private readonly _uploadMyAvatarCommandHandler: UploadMyAvatarCommandHandler
    ) {}

    @Post('/avatar')
    @Authorized()
    @OpenAPI({ summary: 'Upload my avatar' })
    @ResponseSchema(UploadMyAvatarCommandOutput)
    async uploadMyAvatar(@UploadedFile('avatar', { required: true, options: { storage } }) file: Express.Multer.File, @CurrentUser() userAuth: UserAuthenticated): Promise<UploadMyAvatarCommandOutput> {
        const param = new UploadMyAvatarCommandInput();
        param.file = file;
        return await this._uploadMyAvatarCommandHandler.handle(userAuth.userId, param);
    }
}
