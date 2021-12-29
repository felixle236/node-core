import path from 'path';
import { searchFilesSync } from 'utils/File';

const files = searchFilesSync(path.join(__dirname, './**/*Register{.js,.ts}'));
files.forEach(file => require(file));
