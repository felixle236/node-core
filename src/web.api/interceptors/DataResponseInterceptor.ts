import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';

@Interceptor()
export class DataResponseInterceptor implements InterceptorInterface {
    // @ts-ignore
    intercept(action: Action, data: any) {
        if (Buffer.isBuffer(data))
            return data;
        return { data };
    }
}
