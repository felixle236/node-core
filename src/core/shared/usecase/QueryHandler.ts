import { IDataResponse } from './DataResponse';
import { HandleOption } from './HandleOption';

export abstract class QueryHandler<TIn, TOut extends IDataResponse> {
    abstract handle(param: number | string | TIn, param2?: HandleOption): Promise<TOut>;
}
