import './RedisContext';
import path from 'path';
import { getDirectoriesSync, getFilesSync } from 'utils/File';

const folder = path.join(__dirname, './repositories');
for (const childFolder of getDirectoriesSync(folder)) {
    for (const file of getFilesSync(`${folder}/${childFolder}`)) {
        if (!file.includes('.spec'))
            require(`${folder}/${childFolder}/${file}`);
    }
}
