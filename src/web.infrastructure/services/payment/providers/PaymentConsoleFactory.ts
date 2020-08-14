import { IPaymentParam, IPaymentService } from '../../../../web.core/gateways/services/IPaymentService';

export class PaymentConsoleFactory implements IPaymentService {
    async pay(data: IPaymentParam): Promise<any> {
        console.log('PaymentService.pay', data);
        return data;
    }
}
