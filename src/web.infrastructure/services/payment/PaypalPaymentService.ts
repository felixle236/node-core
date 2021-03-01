import Container, { Service } from 'typedi';
import { IS_DEVELOPMENT, PAYPAL_KEY } from '../../../configs/Configuration';
import { ILogService } from '../../../web.core/gateways/services/ILogService';
import { IPaypalPaymentParam, IPaypalPaymentService } from '../../../web.core/gateways/services/IPaypalPaymentService';

@Service('paypal.payment.service')
export class PaypalPaymentService implements IPaypalPaymentService {
    private readonly _apiKey: string;
    private readonly _logService = Container.get<ILogService>('log.service');

    constructor() {
        this._apiKey = PAYPAL_KEY;
    }

    async pay(data: IPaypalPaymentParam): Promise<any> {
        if (IS_DEVELOPMENT)
            this._logService.info('PaypalPaymentService.pay', data);
        this._logService.info(this._apiKey);
    }
}
