import { Request } from 'express';
import { Logger } from 'winston';

export interface IRequest extends Request {
    log: Logger;
}
