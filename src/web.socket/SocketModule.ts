import * as fs from 'fs';
import * as path from 'path';

const controllerPath = path.join(__dirname, './controllers');
const middlewarePath = path.join(__dirname, './middlewares');

fs.readdirSync(controllerPath).forEach(file => require(`${controllerPath}/${file}`));
fs.readdirSync(middlewarePath).forEach(file => require(`${middlewarePath}/${file}`));

export {
    controllerPath,
    middlewarePath
};
