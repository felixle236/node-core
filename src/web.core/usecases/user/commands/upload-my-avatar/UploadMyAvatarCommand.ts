import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class UploadMyAvatarCommand implements ICommand {
    userAuthId: string;
    file: Express.Multer.File;
}
