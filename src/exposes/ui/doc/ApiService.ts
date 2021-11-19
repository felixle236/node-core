import { Server } from 'http';
import path from 'path';
import { SWAGGER_UI_URL } from 'config/Configuration';
import express from 'express';
import swaggerUiExpress, { SwaggerUiOptions } from 'swagger-ui-express';

export class ApiService {
    static init(port: number, callback?: () => void): Server {
        const app = express();
        app.use(express.static(path.join(__dirname, 'public')));

        app.get('/health', (_req, res) => {
            res.status(200).end('ok');
        });

        const webApiOptions = { swaggerUrl: `${SWAGGER_UI_URL}/api-docs/web-api.json` } as SwaggerUiOptions;
        const mobileApiOptions = { swaggerUrl: `${SWAGGER_UI_URL}/api-docs/mobile-api.json` } as SwaggerUiOptions;

        app.use('/web-api', swaggerUiExpress.serveFiles(undefined, webApiOptions), swaggerUiExpress.setup(undefined, webApiOptions));
        app.use('/mobile-api', swaggerUiExpress.serveFiles(undefined, mobileApiOptions), swaggerUiExpress.setup(undefined, mobileApiOptions));
        return app.listen(port, '0.0.0.0', callback);
    }
}
