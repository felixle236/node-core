import { IQuery } from '../../../../domain/common/interactor/interfaces/IQuery';

export class SigninQuery implements IQuery {
    email: string;
    password: string;
}
