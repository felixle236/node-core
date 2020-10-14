import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class CreateRoleCommand implements ICommand {
    name: string;
}
