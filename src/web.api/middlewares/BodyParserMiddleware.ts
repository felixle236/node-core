import * as bodyParser from 'body-parser';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { NextFunction, Request, Response } from 'express';

@Middleware({ type: 'before', priority: 5 })
export class BodyParserMiddleware implements ExpressMiddlewareInterface {
    private readonly _jsonBodyParser;

    constructor() {
        this._jsonBodyParser = bodyParser.json();
    }

    use(req: Request, res: Response, next: NextFunction) {
        this._jsonBodyParser(req, res, next);
    }
}
