
import { IQuery } from '../../../../domain/common/interactor/interfaces/IQuery';

export class JwtAuthUserQuery implements IQuery {
    token: string;
    roleIds?: string[];
}
