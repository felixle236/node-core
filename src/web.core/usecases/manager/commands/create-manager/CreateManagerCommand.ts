import { RoleId } from '../../../../domain/enums/role/RoleId';

export class CreateManagerCommand {
    roleAuthId: RoleId;
    firstName: string;
    lastName: string | null;
    email: string;
    password: string;
}
