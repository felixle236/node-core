import { IsNotEmptyObject } from 'shared/decorators/ValidationDecorator';

export class UploadAvatarInput {
    @IsNotEmptyObject()
    file: Express.Multer.File;
}
