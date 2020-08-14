import { IPaymentParam, IPaymentService } from '../../../../web.core/gateways/services/IPaymentService';
import { Stripe } from 'stripe';

export class StripeFactory implements IPaymentService {
    private readonly _stripe: Stripe;

    constructor(apiKey: string) {
        this._stripe = new Stripe(apiKey, {
            apiVersion: '2020-03-02'
        });
    }

    async pay(data: IPaymentParam): Promise<string> {
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
