import { IPaymentService } from '../../../../web.core/interfaces/gateways/payments/IPaymentService';

export class LoggingFactory implements IPaymentService {
    constructor(private dataLogging: boolean) { }

    pay(data: any): Promise<any> {
        if (this.dataLogging) console.log('PaymentService.send', data);
        return Promise.resolve(data);
    }
}
