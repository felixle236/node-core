import { ENABLE_DATA_LOGGING, PAYMENT_TYPE, STRIPE_KEY } from '../../../constants/Environments';
import { IPaymentService } from '../../../web.core/interfaces/gateways/payments/IPaymentService';
import { LoggingFactory } from './providers/LoggingFactory';
import { PaymentType } from '../../../constants/Enums';
import { PaypalFactory } from './providers/PaypalFactory';
import { Service } from 'typedi';
import { StripeFactory } from './providers/StripeFactory';

@Service('payment.service')
export class PaymentService {
    private payment: IPaymentService;

    constructor() {
        switch (PAYMENT_TYPE) {
        case PaymentType.STRIPE:
            this.payment = new StripeFactory(STRIPE_KEY);
            break;

        case PaymentType.PAYPAL:
            this.payment = new PaypalFactory();
            break;

        case PaymentType.LOGGING:
        default:
            this.payment = new LoggingFactory(ENABLE_DATA_LOGGING);
            break;
        }
    }

    async pay(data: any): Promise<any> {
        return await this.payment.pay(data);
    }
}
