import { UsecaseOption } from '../UsecaseOption';

export interface IUsecaseHandler<TIn, TOut> {
  handle(param: number | string | TIn | UsecaseOption, param2?: TIn | UsecaseOption, param3?: UsecaseOption): Promise<TOut>;
}
