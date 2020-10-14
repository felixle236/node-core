
import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';

export class JwtAuthUserQuery implements IQuery {
    token: string;
    roleIds?: string[];
}
