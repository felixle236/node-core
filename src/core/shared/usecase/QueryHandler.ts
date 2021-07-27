import { IDbQueryRunner } from '@shared/database/interfaces/IDbQueryRunner';

export abstract class QueryHandler<TIn, TOut> {
    abstract handle(param: TIn): Promise<TOut>;
    abstract handle(param: TIn, param2: IDbQueryRunner): Promise<TOut>;
}
