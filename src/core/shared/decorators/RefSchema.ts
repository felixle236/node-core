/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
import { JSONSchema } from 'class-validator-jsonschema';

export const COMPONENT_SCHEMA_PATH = '#/components/schemas/';

/**
 * Reference schema object
 */
export function RefSchemaObject(type: Function): (target: object | Function, key?: string | undefined) => void {
    return JSONSchema({ type: 'object', $ref: COMPONENT_SCHEMA_PATH + type.name });
}

/**
 * Reference schema object
 */
export function RefSchemaArray(type: Function): (target: object | Function, key?: string | undefined) => void {
    return JSONSchema({ type: 'array', items: { $ref: COMPONENT_SCHEMA_PATH + type.name } });
}
