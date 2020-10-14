import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class DeleteRoleCommand implements ICommand {
    id: string;
}
