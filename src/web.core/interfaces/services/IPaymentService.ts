import { IPaymentParam } from '../models/payment/IPaymentParam';

export interface IPaymentService {
    pay(data: IPaymentParam): Promise<string>;
}
