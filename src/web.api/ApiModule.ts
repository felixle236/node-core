import './ApiAuthenticator';
import * as fs from 'fs';
import * as path from 'path';

const folder = path.join(__dirname, './controllers');
fs.readdirSync(folder).forEach(file => require(`${folder}/${file}`));
