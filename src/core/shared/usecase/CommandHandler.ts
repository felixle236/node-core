import { IDataResponse } from './DataResponse';
import { HandleOption } from './HandleOption';

export abstract class CommandHandler<TIn, TOut extends IDataResponse> {
    abstract handle(param: number | string | TIn, param2?: TIn | HandleOption, param3?: HandleOption): Promise<TOut>;
}
