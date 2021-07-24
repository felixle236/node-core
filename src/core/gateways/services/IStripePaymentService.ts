export interface IStripePaymentParam {
    name: string;
    email: string;
    description: string;
    token: string;
    amount: number;
}

export interface IStripePaymentService {
    pay(data: IStripePaymentParam): Promise<string>;
}
