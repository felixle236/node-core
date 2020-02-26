export interface IPaymentService {
    pay(data: any): Promise<any>;
}
