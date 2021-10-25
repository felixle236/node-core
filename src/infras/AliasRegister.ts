/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import moduleAlias from 'module-alias';
/* Note: Do not import/require any file has used the path alias before execute 'addAliases' function below. */

// Read environments for running migration
if (!process.env.NODE_ENV)
    require('dotenv').config();

/**
 * Map path for alias.
 */
function mapPathAlias(aliasPath: string): string {
    const dir = !process.env.NODE_ENV || process.env.NODE_ENV === 'local' ? 'src' : 'dist';
    return path.join(process.cwd(), `${dir}/${aliasPath}`);
}

moduleAlias.addAliases({
    '@configs': mapPathAlias('configs'),
    '@domain': mapPathAlias('core/domain'),
    '@gateways': mapPathAlias('core/gateways'),
    '@shared': mapPathAlias('core/shared'),
    '@usecases': mapPathAlias('core/usecases'),
    '@infras': mapPathAlias('infras'),
    '@data': mapPathAlias('infras/data'),
    '@services': mapPathAlias('infras/services'),
    '@utils': mapPathAlias('utils')
});
