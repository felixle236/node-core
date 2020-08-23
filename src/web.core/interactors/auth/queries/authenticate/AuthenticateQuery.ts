
import { IQuery } from '../../../../domain/common/interactor/interfaces/IQuery';

export class AuthenticateQuery implements IQuery {
    token: string;
    roleIds?: string[];
}
