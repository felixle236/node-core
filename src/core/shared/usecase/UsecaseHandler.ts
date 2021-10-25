import { UsecaseOption } from './UsecaseOption';

export abstract class UsecaseHandler<TIn, TOut> {
    abstract handle(param: number | string | TIn | UsecaseOption, param2?: TIn | UsecaseOption, param3?: UsecaseOption): Promise<TOut>;
}
