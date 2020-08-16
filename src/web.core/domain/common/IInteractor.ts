import { UserAuthenticated } from './UserAuthenticated';

export interface IInteractor<TIn, TOut> {
    handle(param: TIn, userAuth?: UserAuthenticated): TOut | Promise<TOut>;
}
