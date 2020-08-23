import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class UploadMyAvatarCommand implements ICommand {
    id: string;
    file: Express.Multer.File;
}
