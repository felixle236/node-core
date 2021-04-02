const fs = require('fs');
const path = require('path');

const param = process.argv.length > 2 && process.argv[2].trim();
if (!param.includes(':') || param.split(':').length !== 3) {
    console.error('\x1b[35mParam is invalid!\n\x1b[0m');
    return;
}

let moduleName = param.split(':')[0];
let folder = moduleName;

if (moduleName.includes('#')) {
    folder = moduleName.split('#')[0];
    moduleName = moduleName.split('#')[1];

    if (!folder || !moduleName) {
        console.error('\x1b[35mMissing name of the module or sub module!\n\x1b[0m');
        return;
    }
    if (folder === moduleName) {
        console.error('\x1b[35mThe name of module cannot match sub module!\n\x1b[0m');
        return;
    }
    console.log('Module:\x1b[32m', folder, '\x1b[0m');
    console.log('Sub-Module:\x1b[32m', moduleName, '\x1b[0m');
}
else
    console.log('Module:\x1b[32m', moduleName, '\x1b[0m');

folder = convertToDirectoryName(folder);
const methodName = param.split(':')[1];
const usecaseFncName = param.split(':')[2];

console.log('Method:\x1b[32m', methodName, '\x1b[0m');
console.log('Usecase:\x1b[32m', usecaseFncName, '\x1b[0m');

if (!moduleName || !methodName || !usecaseFncName) {
    console.error('\x1b[35mMissing param!\n\x1b[0m');
    return;
}

const usecaseFncFolder = convertToDirectoryName(usecaseFncName);
const camelName = moduleName.substr(0, 1).toLowerCase() + moduleName.substr(1);
const pascalName = moduleName.substr(0, 1).toUpperCase() + moduleName.substr(1);
const upperCaseName = convertToDirectoryName(moduleName).replace(/-/g, '_').toUpperCase();
const lowerCaseName = upperCaseName.toLowerCase();

if (methodName.toLowerCase() === 'query') {
    const queryUsecasePath = path.join(__dirname, `../src/web.core/usecases/${folder}/queries/${usecaseFncFolder}/${usecaseFncName}Query.ts`);
    const queryUsecase = getFileContent(path.join(__dirname, './web.core/usecases/queries/usecase-query-func/UsecaseQuery.tmp'));

    const queryHandlerUsecasePath = path.join(__dirname, `../src/web.core/usecases/${folder}/queries/${usecaseFncFolder}/${usecaseFncName}QueryHandler.ts`);
    const queryHandlerUsecase = getFileContent(path.join(__dirname, './web.core/usecases/queries/usecase-query-func/UsecaseQueryHandler.tmp'));

    const queryResultUsecasePath = path.join(__dirname, `../src/web.core/usecases/${folder}/queries/${usecaseFncFolder}/${usecaseFncName}QueryResult.ts`);
    const queryResultUsecase = getFileContent(path.join(__dirname, './web.core/usecases/queries/usecase-query-func/UsecaseQueryResult.tmp'));

    createDirectories(
        queryUsecasePath,
        queryHandlerUsecasePath,
        queryResultUsecasePath
    );

    fs.writeFileSync(queryUsecasePath, queryUsecase);
    fs.writeFileSync(queryHandlerUsecasePath, queryHandlerUsecase);
    fs.writeFileSync(queryResultUsecasePath, queryResultUsecase);
}
else if (methodName.toLowerCase() === 'command') {
    const commandUsecasePath = path.join(__dirname, `../src/web.core/usecases/${folder}/commands/${usecaseFncFolder}/${usecaseFncName}Command.ts`);
    const commandUsecase = getFileContent(path.join(__dirname, './web.core/usecases/commands/usecase-command-func/UsecaseCommand.tmp'));

    const commandHandlerUsecasePath = path.join(__dirname, `../src/web.core/usecases/${folder}/commands/${usecaseFncFolder}/${usecaseFncName}CommandHandler.ts`);
    const commandHandlerUsecase = getFileContent(path.join(__dirname, './web.core/usecases/commands/usecase-command-func/UsecaseCommandHandler.tmp'));

    createDirectories(
        commandUsecasePath,
        commandHandlerUsecasePath
    );

    fs.writeFileSync(commandUsecasePath, commandUsecase);
    fs.writeFileSync(commandHandlerUsecasePath, commandHandlerUsecase);
}

console.log('\n\x1b[32mGenerate usecase "' + usecaseFncName + '" successfully.\x1b[0m\n');

/**
 * Get content of special file
 * @param {string} path Generate source code to directory
 */
function getFileContent(path) {
    return fs.readFileSync(path, 'utf8')
        .replace(/{folder}/g, folder)
        .replace(/{UsecaseName}/g, usecaseFncName)
        .replace(/{camelName}/g, camelName)
        .replace(/{PascalName}/g, pascalName)
        .replace(/{UPPER_CASE_NAME}/g, upperCaseName)
        .replace(/{lower_case_name}/g, lowerCaseName);
}

/**
 * Create directories if they are not exist
 * @param {string[]} directories list directory
 */
function createDirectories(...files) {
    for (let i = 0; i < files.length; i++) {
        const directory = path.dirname(files[i]);
        if (!fs.existsSync(directory))
            fs.mkdirSync(directory, { recursive: true });
    }
}

/**
 * Convert directory name
 * @param {string} directoryName directory name
 */
function convertToDirectoryName(directoryName) {
    let match;
    while ((match = /[A-Z]/g.exec(directoryName)) != null) {
        if (match.index === 0)
            directoryName = directoryName[match.index].toLowerCase() + directoryName.substr(match.index + 1);
        else
            directoryName = directoryName.substr(0, match.index) + '-' + directoryName[match.index].toLowerCase() + directoryName.substr(match.index + 1);
    }
    return directoryName;
}
