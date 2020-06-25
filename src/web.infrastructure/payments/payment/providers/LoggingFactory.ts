import { ENABLE_DATA_LOGGING } from '../../../../constants/Environments';
import { IPaymentService } from '../../../../web.core/interfaces/gateways/payments/IPaymentService';

export class LoggingFactory implements IPaymentService {
    pay(data: any): Promise<any> {
        if (ENABLE_DATA_LOGGING) console.log('PaymentService.send', data);
        return Promise.resolve(data);
    }
}
