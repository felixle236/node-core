import { Stripe } from 'stripe';
import Container, { Service } from 'typedi';
import { IS_DEVELOPMENT, STRIPE_KEY } from '../../../configs/Configuration';
import { ILogService } from '../../../web.core/gateways/services/ILogService';
import { IStripePaymentParam, IStripePaymentService } from '../../../web.core/gateways/services/IStripePaymentService';

@Service('stripe.payment.service')
export class StripePaymentService implements IStripePaymentService {
    private readonly _stripe: Stripe;
    private readonly _logService = Container.get<ILogService>('log.service');

    constructor() {
        this._stripe = new Stripe(STRIPE_KEY, {
            apiVersion: '2020-08-27'
        });
    }

    async pay(data: IStripePaymentParam): Promise<string> {
        if (IS_DEVELOPMENT) {
            this._logService.info('StripePaymentService.pay', data);
            return 'customer id';
        }

        const customerParams: Stripe.CustomerCreateParams = {
            name: data.name,
            email: data.email,
            source: data.token
        };
        const customer = await this._stripe.customers.create(customerParams);

        const chargeParams: Stripe.ChargeCreateParams = {
            amount: data.amount * 100,
            currency: 'usd',
            customer: customer.id,
            description: data.description
        };
        await this._stripe.charges.create(chargeParams);
        return customer.id;
    }
}
