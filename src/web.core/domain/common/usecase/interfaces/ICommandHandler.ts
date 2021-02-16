export interface ICommandHandler<TIn, TOut> {
    handle(param: TIn): Promise<TOut>;
}
