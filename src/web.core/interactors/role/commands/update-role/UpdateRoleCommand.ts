import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class UpdateRoleCommand implements ICommand {
    id: string;
    name: string;
}
