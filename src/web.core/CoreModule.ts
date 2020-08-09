import * as fs from 'fs';
import * as path from 'path';

const folder = path.join(__dirname, './usecase/interactors');
fs.readdirSync(folder).forEach(file => require(`${folder}/${file}`));
