export interface IQueryHandler<TIn, TOut> {
    handle(param: TIn): Promise<TOut>;
}
