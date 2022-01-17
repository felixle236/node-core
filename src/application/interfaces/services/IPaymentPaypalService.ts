export interface IPaymentPaypalParam {
  name: string;
  email: string;
  description: string;
  token: string;
  amount: number;
}

export interface IPaymentPaypalService {
  pay(data: IPaymentPaypalParam): Promise<string>;
}
