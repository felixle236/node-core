/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import { SWAGGER_UI_APIS } from 'config/Configuration';
import { writeFile } from 'utils/File';

const apiName = process.argv[2];
if (!apiName || !SWAGGER_UI_APIS.includes(apiName)) {
  throw new Error('Can not generate Api documents');
}

const specs = require(`../../api/${apiName}/ApiDocument`).getApiSpecs();
writeFile(path.join(__dirname, `./public/api-docs/${apiName}-api.json`), JSON.stringify(specs));
