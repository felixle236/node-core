import { IPaymentParam } from '../../types/IPaymentParam';

export interface IPaymentService {
    pay(data: IPaymentParam): Promise<string>;
}
