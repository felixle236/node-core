
import { IQuery } from '../../../../domain/common/interactor/interfaces/IQuery';

export class AuthenticateUserQuery implements IQuery {
    token: string;
    roleIds?: string[];
}
