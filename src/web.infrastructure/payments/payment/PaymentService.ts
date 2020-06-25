import { PAYMENT_TYPE, STRIPE_KEY } from '../../../constants/Environments';
import { IPaymentParam } from '../../../web.core/interfaces/types/IPaymentParam';
import { IPaymentService } from '../../../web.core/interfaces/gateways/payments/IPaymentService';
import { LoggingFactory } from './providers/LoggingFactory';
import { PaymentType } from '../../../constants/Enums';
import { PaypalFactory } from './providers/PaypalFactory';
import { Service } from 'typedi';
import { StripeFactory } from './providers/StripeFactory';

@Service('payment.service')
export class PaymentService implements IPaymentService {
    private readonly _payment: IPaymentService;

    constructor() {
        switch (PAYMENT_TYPE) {
        case PaymentType.STRIPE:
            this._payment = new StripeFactory(STRIPE_KEY);
            break;

        case PaymentType.PAYPAL:
            this._payment = new PaypalFactory();
            break;

        case PaymentType.LOGGING:
        default:
            this._payment = new LoggingFactory();
            break;
        }
    }

    async pay(data: IPaymentParam): Promise<string> {
        return await this._payment.pay(data);
    }
}
