import path from 'path';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { InjectDb } from 'shared/types/Injection';
import Container from 'typedi';
import { getDirectoriesSync, getFilesSync } from 'utils/file';
import { DbContext } from './DbContext';

Container.set<IDbContext>(InjectDb.DbContext, new DbContext());

const folder = path.join(__dirname, './repositories');
getDirectoriesSync(folder).forEach(childFolder => {
    getFilesSync(`${folder}/${childFolder}`).forEach(file => {
        if (!file.includes('.spec'))
            require(`${folder}/${childFolder}/${file}`);
    });
});
