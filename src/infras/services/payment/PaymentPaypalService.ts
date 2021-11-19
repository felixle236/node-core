import { ILogService } from 'application/interfaces/services/ILogService';
import { IPaymentPaypalParam, IPaymentPaypalService } from 'application/interfaces/services/IPaymentPaypalService';
import { PAYPAL_KEY } from 'config/Configuration';
import { InjectService } from 'shared/types/Injection';
import Container, { Service } from 'typedi';

@Service(InjectService.PaymentPaypal)
export class PaymentPaypalService implements IPaymentPaypalService {
    private readonly _apiKey: string;
    private readonly _logService = Container.get<ILogService>(InjectService.Log);

    constructor() {
        this._apiKey = PAYPAL_KEY;
        this._logService.info('Init paypal service', this._apiKey);
    }

    async pay(data: IPaymentPaypalParam): Promise<any> {
        this._logService.info('PaypalPaymentService.pay', data);
    }
}
