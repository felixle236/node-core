import { IQuery } from './IQuery';

export interface IQueryHandler<TIn extends IQuery, TOut> {
    handle(param: TIn): Promise<TOut>;
}
