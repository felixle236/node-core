export interface IPaymentStripeParam {
  name: string;
  email: string;
  description: string;
  token: string;
  amount: number;
}

export interface IPaymentStripeService {
  pay(data: IPaymentStripeParam): Promise<string>;
}
