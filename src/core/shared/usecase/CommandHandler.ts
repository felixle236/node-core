export abstract class CommandHandler<TIn, TOut> {
    abstract handle(_param: number | string | TIn, _param2: TIn): Promise<TOut>;
}
