import './DbContext';
import * as path from 'path';
import { getFilesSync } from '../../../libs/file';

const folder = path.join(__dirname, './repositories');
getFilesSync(folder).forEach(file => import(`${folder}/${file}`));
