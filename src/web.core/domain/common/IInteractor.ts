import { UserAuthenticated } from './UserAuthenticated';

export interface IInteractor<TIn, TOut> {
    execute(param: TIn, userAuth?: UserAuthenticated): TOut | Promise<TOut>;
}
