import { IPaymentService } from '../../../../web.core/interfaces/gateways/payments/IPaymentService';
import { Stripe } from 'stripe';

export class StripeFactory implements IPaymentService {
    private stripe: Stripe;

    constructor(apiKey: string) {
        this.stripe = new Stripe(apiKey, {
            apiVersion: '2019-12-03'
        });
    }

    async pay(data: any): Promise<any> {
        const customer = await this.stripe.customers.create({
            name: data.name,
            email: data.email,
            source: data.stripeToken
        });
        await this.stripe.charges.create({
            amount: data.amount * 100,
            currency: 'usd',
            customer: customer.id,
            description: data.description
        });
        return customer.id;
    }
}
