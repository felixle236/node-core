import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { OpenAPIObject } from 'openapi3-ts';
import { getMetadataArgsStorage, RoutingControllersOptions } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { PROJECT_NAME } from '../configs/Configuration';

export class ApiDocument {
    constructor(
        private readonly _options: RoutingControllersOptions
    ) {}

    generate(): OpenAPIObject {
        const schemas = validationMetadatasToSchemas({
            refPointerPrefix: '#/components/schemas/'
        });
        const storage = getMetadataArgsStorage();

        return routingControllersToSpec(storage, this._options, {
            info: {
                title: `${PROJECT_NAME} API`,
                description: 'Developed by felix.le.236@gmail.com',
                version: '1.0.0',
                contact: {
                    name: 'Felix Le',
                    email: 'felix.le.236@gmail.com',
                    url: ''
                }
            },
            servers: [{
                url: 'http://localhost:3000',
                description: 'Localhost'
            }, {
                url: 'https://localhost.dev',
                description: 'Development Environment'
            }, {
                url: 'https://localhost.stag',
                description: 'Staging Environment'
            }],
            security: [{
                bearerAuth: []
            }],
            components: {
                schemas,
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            }
        }) as OpenAPIObject;
    }
}
