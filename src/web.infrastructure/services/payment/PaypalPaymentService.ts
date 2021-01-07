import { Service } from 'typedi';
import { IS_DEVELOPMENT, PAYPAL_KEY } from '../../../configs/Configuration';
import { IPaypalPaymentParam, IPaypalPaymentService } from '../../../web.core/gateways/services/IPaypalPaymentService';

@Service('paypal.payment.service')
export class PaypalPaymentService implements IPaypalPaymentService {
    private readonly _apiKey: string;

    constructor() {
        this._apiKey = PAYPAL_KEY;
    }

    async pay(data: IPaypalPaymentParam): Promise<any> {
        if (IS_DEVELOPMENT)
            console.log('PaypalPaymentService.pay', data);
        console.log(this._apiKey);
    }
}
