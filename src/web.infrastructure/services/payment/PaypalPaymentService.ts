import Container, { Service } from 'typedi';
import { PAYPAL_KEY } from '../../../configs/Configuration';
import { ILogService } from '../../../web.core/gateways/services/ILogService';
import { IPaypalPaymentParam, IPaypalPaymentService } from '../../../web.core/gateways/services/IPaypalPaymentService';

@Service('paypal_payment.service')
export class PaypalPaymentService implements IPaypalPaymentService {
    private readonly _apiKey: string;
    private readonly _logService = Container.get<ILogService>('log.service');

    constructor() {
        this._apiKey = PAYPAL_KEY;
        this._logService.debug('Init paypal service', this._apiKey);
    }

    async pay(data: IPaypalPaymentParam): Promise<any> {
        this._logService.debug('PaypalPaymentService.pay', data);
    }
}
