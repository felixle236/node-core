import { IPaymentParam, IPaymentService } from '../../../web.core/gateways/services/IPaymentService';
import { PAYMENT_PROVIDER, PAYPAL_KEY, STRIPE_KEY } from '../../../configs/Configuration';
import { PaymentConsoleFactory } from './providers/PaymentConsoleFactory';
import { PaymentProvider } from '../../../configs/ServiceProvider';
import { PaypalFactory } from './providers/PaypalFactory';
import { Service } from 'typedi';
import { StripeFactory } from './providers/StripeFactory';

@Service('payment.service')
export class PaymentService implements IPaymentService {
    private readonly _payment: IPaymentService;

    constructor() {
        switch (PAYMENT_PROVIDER) {
        case PaymentProvider.STRIPE:
            this._payment = new StripeFactory(STRIPE_KEY);
            break;

        case PaymentProvider.PAYPAL:
            this._payment = new PaypalFactory(PAYPAL_KEY);
            break;

        case PaymentProvider.CONSOLE:
        default:
            this._payment = new PaymentConsoleFactory();
            break;
        }
    }

    async pay(data: IPaymentParam): Promise<string> {
        return await this._payment.pay(data);
    }
}
