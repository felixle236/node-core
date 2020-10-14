import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class UpdateRoleCommand implements ICommand {
    id: string;
    name: string;
}
