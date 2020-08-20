import { IInput } from './IInput';
import { IOutput } from './IOutput';

export interface IQueryHandler<TIn extends IInput, TOut> {
    handle(param: TIn): Promise<IOutput<TOut>>;
}
