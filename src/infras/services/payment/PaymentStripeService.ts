import { IPaymentStripeParam, IPaymentStripeService } from 'application/interfaces/services/IPaymentStripeService';
import { STRIPE_KEY } from 'config/Configuration';
import { InjectService } from 'shared/types/Injection';
import { Stripe } from 'stripe';
import { Service } from 'typedi';

@Service(InjectService.PaymentStripe)
export class PaymentStripeService implements IPaymentStripeService {
    private readonly _stripe: Stripe;

    constructor() {
        this._stripe = new Stripe(STRIPE_KEY, {
            apiVersion: '2020-08-27'
        });
    }

    async pay(data: IPaymentStripeParam): Promise<string> {
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
