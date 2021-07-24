import { PAYPAL_KEY } from '@configs/Configuration';
import { ILogService } from '@gateways/services/ILogService';
import { IPaypalPaymentParam, IPaypalPaymentService } from '@gateways/services/IPaypalPaymentService';
import Container, { Service } from 'typedi';

@Service('paypal_payment.service')
export class PaypalPaymentService implements IPaypalPaymentService {
    private readonly _apiKey: string;
    private readonly _logService = Container.get<ILogService>('log.service');

    constructor() {
        this._apiKey = PAYPAL_KEY;
        this._logService.info('Init paypal service', this._apiKey);
    }

    async pay(data: IPaypalPaymentParam): Promise<any> {
        this._logService.info('PaypalPaymentService.pay', data);
    }
}
