/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import { writeFile } from 'utils/file';

const type = process.argv[2];
if (!type || !['web', 'mobile'].includes(type))
    throw new Error('Can not generate Api documents');

const specs = require(`../../api/${type}/ApiDocument`).getApiSpecs();
writeFile(path.join(__dirname, `./public/api-docs/${type}-api.json`), JSON.stringify(specs));
