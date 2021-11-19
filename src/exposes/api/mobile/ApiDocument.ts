import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { DOMAIN, ENVIRONMENT, MOBILE_API_URL, PROJECT_NAME, PROTOTYPE } from 'config/Configuration';
import { OpenAPIObject } from 'openapi3-ts';
import { createExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { COMPONENT_SCHEMA_PATH } from 'shared/decorators/RefSchema';
import { ApiService } from './ApiService';

/**
 * Get API specs
 */
export function getApiSpecs(): OpenAPIObject {
    const options = ApiService.getRoutingOptions();
    createExpressServer(options);

    const schemas = validationMetadatasToSchemas({
        refPointerPrefix: COMPONENT_SCHEMA_PATH
    });
    const storage = getMetadataArgsStorage();

    return routingControllersToSpec(storage, options, {
        info: {
            title: `${PROJECT_NAME} API For Mobile Application`,
            description: 'Developed by felix.le.236@gmail.com',
            version: '1.0.0',
            contact: {
                name: 'Felix Lee',
                email: 'felix.le.236@gmail.com',
                url: `${PROTOTYPE}://${DOMAIN}`
            }
        },
        servers: [{
            url: MOBILE_API_URL,
            description: ENVIRONMENT
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
