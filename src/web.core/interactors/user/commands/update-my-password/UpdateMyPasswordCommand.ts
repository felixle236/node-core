import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class UpdateMyPasswordCommand implements ICommand {
    userAuthId: string;
    oldPassword: string;
    password: string;
}
