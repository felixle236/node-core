export interface IPaymentService {
    pay(data: IPaymentParam): Promise<string>;
}

export interface IPaymentParam {
    name: string;
    email: string;
    description: string;
    token: string;
    amount: number;
}
