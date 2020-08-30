import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class UploadMyAvatarCommand implements ICommand {
    userAuthId: string;
    file: Express.Multer.File;
}
