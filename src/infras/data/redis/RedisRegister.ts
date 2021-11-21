import path from 'path';
import { IRedisContext } from 'shared/database/interfaces/IRedisContext';
import { InjectDb } from 'shared/types/Injection';
import Container from 'typedi';
import { getDirectoriesSync, getFilesSync } from 'utils/file';
import { RedisContext } from './RedisContext';

Container.set<IRedisContext>(InjectDb.RedisContext, new RedisContext());

const folder = path.join(__dirname, './repositories');
getDirectoriesSync(folder).forEach(childFolder => {
    getFilesSync(`${folder}/${childFolder}`).forEach(file => {
        if (!file.includes('.spec'))
            require(`${folder}/${childFolder}/${file}`);
    });
});
