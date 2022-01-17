/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
import { IRequest } from '../request/IRequest';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Request extends IRequest {}
  }
}
