import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class UpdateMyPasswordCommand implements ICommand {
    userAuthId: string;
    oldPassword: string;
    password: string;
}
