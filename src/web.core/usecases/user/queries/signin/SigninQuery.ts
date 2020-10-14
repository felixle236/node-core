import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';

export class SigninQuery implements IQuery {
    email: string;
    password: string;
}
