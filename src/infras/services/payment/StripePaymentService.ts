import { STRIPE_KEY } from '@configs/Configuration';
import { IStripePaymentParam, IStripePaymentService } from '@gateways/services/IStripePaymentService';
import { Stripe } from 'stripe';
import { Service } from 'typedi';

@Service('stripe_payment.service')
export class StripePaymentService implements IStripePaymentService {
    private readonly _stripe: Stripe;

    constructor() {
        this._stripe = new Stripe(STRIPE_KEY, {
            apiVersion: '2020-08-27'
        });
    }

    async pay(data: IStripePaymentParam): Promise<string> {
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
