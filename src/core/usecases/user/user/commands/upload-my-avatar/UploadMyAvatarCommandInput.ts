import { IsNotEmptyObject } from 'class-validator';

export class UploadMyAvatarCommandInput {
    @IsNotEmptyObject()
    file: Express.Multer.File;
}
