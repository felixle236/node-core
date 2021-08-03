import './DbContext';
import path from 'path';
import { getDirectoriesSync, getFilesSync } from '@libs/file';

const folder = path.join(__dirname, './repositories');
getFilesSync(folder).forEach(file => {
    if (!file.includes('.spec'))
        require(`${folder}/${file}`);
});

getDirectoriesSync(folder).forEach(childFolder => {
    getFilesSync(`${folder}/${childFolder}`).forEach(file => {
        if (!file.includes('.spec'))
            require(`${folder}/${childFolder}/${file}`);
    });
});
