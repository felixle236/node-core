import { Server } from 'http';
import path from 'path';
import { ENVIRONMENT, PROJECT_SUPPORT_NAME, PROJECT_NAME, SWAGGER_UI_APIS, SWAGGER_UI_BASIC_PASS, SWAGGER_UI_BASIC_USER, SWAGGER_UI_URL, PROJECT_SUPPORT_EMAIL } from 'config/Configuration';
import express from 'express';
import expressBasicAuth from 'express-basic-auth';
import swaggerUiExpress, { SwaggerUiOptions } from 'swagger-ui-express';

export class ApiService {
    static init(port: number, callback?: () => void): Server {
        const app = express();
        app.use(express.static(path.join(__dirname, 'public')));

        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');

        const authMiddleware = expressBasicAuth({
            users: { [SWAGGER_UI_BASIC_USER]: SWAGGER_UI_BASIC_PASS },
            challenge: true
        });
        app.get('/', authMiddleware, (_req, res) => {
            res.render('index', { title: `${PROJECT_NAME} API Documentation`, supportName: PROJECT_SUPPORT_NAME, supportEmail: PROJECT_SUPPORT_EMAIL, apis: SWAGGER_UI_APIS, environment: ENVIRONMENT });
        });

        SWAGGER_UI_APIS.forEach(apiName => {
            const apiOptions = { swaggerUrl: `${SWAGGER_UI_URL}/api-docs/${apiName}-api.json` } as SwaggerUiOptions;
            app.use(`/${apiName}-api`, authMiddleware, swaggerUiExpress.serveFiles(undefined, apiOptions), swaggerUiExpress.setup(undefined, apiOptions));
        });

        return app.listen(port, '0.0.0.0', callback);
    }
}
