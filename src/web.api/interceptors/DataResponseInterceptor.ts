import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';
import { PaginationResult } from '../../web.core/domain/common/interactor/PaginationResult';

@Interceptor()
export class DataResponseInterceptor implements InterceptorInterface {
    intercept(_action: Action, data: any) {
        if (data instanceof PaginationResult || Buffer.isBuffer(data))
            return data;
        return { data };
    }
}
