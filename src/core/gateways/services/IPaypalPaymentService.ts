export interface IPaypalPaymentParam {
    name: string;
    email: string;
    description: string;
    token: string;
    amount: number;
}

export interface IPaypalPaymentService {
    pay(data: IPaypalPaymentParam): Promise<string>;
}
