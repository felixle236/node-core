import { IsNotEmptyObject } from '@shared/decorators/ValidationDecorator';

export class UploadMyAvatarInput {
    @IsNotEmptyObject()
    file: Express.Multer.File;
}
