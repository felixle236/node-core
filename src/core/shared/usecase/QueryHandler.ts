export abstract class QueryHandler<TIn, TOut> {
    abstract handle(param: TIn): Promise<TOut>;
}
