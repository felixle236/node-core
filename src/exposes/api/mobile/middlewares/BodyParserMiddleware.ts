import { json, NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before', priority: 2 })
export class BodyParserMiddleware implements ExpressMiddlewareInterface {
    private readonly _jsonBodyParser;

    constructor() {
        this._jsonBodyParser = json();
    }

    use(req: Request, res: Response, next: NextFunction): void {
        this._jsonBodyParser(req, res, next);
    }
}
