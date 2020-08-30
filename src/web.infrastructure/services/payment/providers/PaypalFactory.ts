import { IPaymentParam, IPaymentService } from '../../../../web.core/gateways/services/IPaymentService';

export class PaypalFactory implements IPaymentService {
    constructor(_apiKey: string) {}
    async pay(_data: IPaymentParam): Promise<any> {}
}
