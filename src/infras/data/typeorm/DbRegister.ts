import './DbContext';
import path from 'path';
import { getDirectoriesSync, getFilesSync } from 'utils/file';

const folder = path.join(__dirname, './repositories');
getDirectoriesSync(folder).forEach(childFolder => {
    getFilesSync(`${folder}/${childFolder}`).forEach(file => {
        if (!file.includes('.spec'))
            require(`${folder}/${childFolder}/${file}`);
    });
});
