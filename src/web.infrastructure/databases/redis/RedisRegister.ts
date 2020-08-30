import './RedisContext';
import * as path from 'path';
import { getFilesSync } from '../../../libs/file';

const folder = path.join(__dirname, './repositories');
getFilesSync(folder).forEach(file => require(`${folder}/${file}`));
