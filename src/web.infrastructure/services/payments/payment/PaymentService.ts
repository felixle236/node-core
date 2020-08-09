import { IPaymentParam, IPaymentService } from '../../../../web.core/interfaces/services/IPaymentService';
import { PAYMENT_TYPE, STRIPE_KEY } from '../../../../constants/Environments';
import { LoggingFactory } from './providers/LoggingFactory';
import { PaymentSenderType } from '../../../../constants/Enums';
import { PaypalFactory } from './providers/PaypalFactory';
import { Service } from 'typedi';
import { StripeFactory } from './providers/StripeFactory';

@Service('payment.service')
export class PaymentService implements IPaymentService {
    private readonly _payment: IPaymentService;

    constructor() {
        switch (PAYMENT_TYPE) {
        case PaymentSenderType.STRIPE:
            this._payment = new StripeFactory(STRIPE_KEY);
            break;

        case PaymentSenderType.PAYPAL:
            this._payment = new PaypalFactory();
            break;

        case PaymentSenderType.LOGGING:
        default:
            this._payment = new LoggingFactory();
            break;
        }
    }

    async pay(data: IPaymentParam): Promise<string> {
        return await this._payment.pay(data);
    }
}
