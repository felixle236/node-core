import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { NextFunction, Request, Response } from 'express';
import { ENABLE_DATA_LOGGING } from '../../constants/Environments';

@Middleware({ type: 'before' })
export class LoggingMiddleware implements ExpressMiddlewareInterface {
    use(req: Request, _res: Response, next: NextFunction): void {
        if (ENABLE_DATA_LOGGING) {
            console.log('\nRequest API Service:');
            console.log('• Method:', '\x1b[35m', req.method, '\x1b[0m');
            console.log('• URL:', '\x1b[35m', req.originalUrl, '\x1b[0m');
            console.log('• Query:', '\x1b[35m', JSON.stringify(req.query, null, 2), '\x1b[0m');
            console.log('• Body:', '\x1b[35m', JSON.stringify(req.body, null, 2), '\x1b[0m', '\n');
        }
        next();
    }
}
