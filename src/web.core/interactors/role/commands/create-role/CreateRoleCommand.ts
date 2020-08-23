import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class CreateRoleCommand implements ICommand {
    name: string;
    level: number;

    roleAuthLevel: number;
}
