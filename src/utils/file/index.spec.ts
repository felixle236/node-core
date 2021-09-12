import 'mocha';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { appendFile, createDirectory, getDirectories, getDirectoriesSync, getFiles, getFilesSync, readFile, readFileAsText, removeFile, writeFile } from '.';

describe('Utils - File', () => {
    const sandbox = createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('Get directories promise with error', async () => {
        sandbox.stub(fs, 'readdir').callsFake((_path, _options, cb) => {
            cb(new Error(), []);
        });
        const error: Error = await getDirectories('.').catch(error => error);
        expect(error.message).to.not.eq(undefined);
    });

    it('Get directories promise', async () => {
        const directories = await getDirectories('.');
        expect(directories.length).to.gt(0);
    });

    it('Get directories', () => {
        const directories = getDirectoriesSync('.');
        expect(directories.length).to.gt(0);
    });

    it('Get files with error', async () => {
        sandbox.stub(fs, 'readdir').callsFake((_path, _options, cb) => {
            cb(new Error(), []);
        });
        const error: Error = await getFiles('.').catch(error => error);
        expect(error.message).to.not.eq(undefined);
    });

    it('Get files promise', async () => {
        const files = await getFiles('.');
        expect(files.length).to.gt(0);
    });

    it('Get files', () => {
        const files = getFilesSync('.');
        expect(files.length).to.gt(0);
    });

    it('Create directory with the path invalid', done => {
        let path = '/tmp';
        [...Array(12)].forEach(() => {
            path += path;
        });

        try {
            createDirectory(path);
        }
        catch (error: any) {
            expect(error.message).to.eq('The path is invalid!');
            done();
        }
    });

    it('Create directory', () => {
        sandbox.stub(fs, 'existsSync').returns(false);
        const stubDir = sandbox.stub(fs, 'mkdirSync').returns('');
        const path = './tmp/test';

        createDirectory(path);
        expect(stubDir.callCount).to.gt(0);
    });

    it('Read file with file path invalid', async () => {
        const error: Error = await readFile(' ').catch(error => error);
        expect(error.message).to.eq('The path is required!');
    });

    it('Read file with error', async () => {
        sandbox.stub(fs, 'readFile').callsFake(((_path, _option, cb) => {
            cb(new Error(), Buffer.from(''));
        }) as any);
        const error: Error = await readFile('index.ts').catch(error => error);
        expect(error.message).to.not.eq(undefined);
    });

    it('Read file', async () => {
        sandbox.stub(fs, 'readFile').callsFake(((_path, _option, cb) => {
            cb(null, Buffer.from(''));
        }) as any);
        const data = await readFile(path.join(__dirname, 'index.ts'));
        expect(data).to.not.eq(undefined);
    });

    it('Read file as text with file path invalid', async () => {
        const error: Error = await readFileAsText(' ').catch(error => error);
        expect(error.message).to.eq('The path is required!');
    });

    it('Read file as text with error', async () => {
        sandbox.stub(fs, 'readFile').callsFake(((_path, _option, cb) => {
            cb(new Error(), '' as any);
        }) as any);
        const error: Error = await readFileAsText('index.ts').catch(error => error);
        expect(error.message).to.not.eq(undefined);
    });

    it('Read file as text', async () => {
        sandbox.stub(fs, 'readFile').callsFake(((_path, _option, cb) => {
            cb(null, 'test' as any);
        }) as any);
        const data = await readFileAsText(path.join(__dirname, 'index.ts'), 'utf8');
        expect(data).to.eq('test');
    });

    it('Write file with error the path is required', async () => {
        const error: Error = await writeFile(' ', '').catch(error => error);
        expect(error.message).to.eq('The path is required!');
    });

    it('Write file with error the content is required', async () => {
        const error: Error = await writeFile('test.txt', '').catch(error => error);
        expect(error.message).to.eq('The content is required!');
    });

    it('Write file with error', async () => {
        sandbox.stub(fs, 'existsSync').returns(true);
        sandbox.stub(fs, 'writeFile').callsFake(((_path, _content, _option, cb) => {
            cb(new Error());
        }) as any);

        const error: Error = await writeFile('test.txt', 'abc').catch(error => error);
        expect(error.message).to.not.eq(undefined);
    });

    it('Write file successful', async () => {
        sandbox.stub(fs, 'existsSync').onFirstCall().returns(false).onSecondCall().returns(true);
        sandbox.stub(fs, 'writeFile').callsFake(((_path, _content, _option, cb) => {
            cb(null, Buffer.from(''));
        }) as any);

        await writeFile('test.txt', 'abc');
        expect(true).to.eq(true);
    });

    it('Append file with error the path is required', async () => {
        const error: Error = await appendFile(' ', '').catch(error => error);
        expect(error.message).to.eq('The path is required!');
    });

    it('Append file with error the content is required', async () => {
        const error: Error = await appendFile('test.txt', '').catch(error => error);
        expect(error.message).to.eq('The content is required!');
    });

    it('Append file with error', async () => {
        sandbox.stub(fs, 'existsSync').returns(true);
        sandbox.stub(fs, 'appendFile').callsFake(((_path, _content, _option, cb) => {
            cb(new Error());
        }) as any);

        const error: Error = await appendFile('test.txt', 'abc').catch(error => error);
        expect(error.message).to.not.eq(undefined);
    });

    it('Append file successful', async () => {
        sandbox.stub(fs, 'existsSync').onFirstCall().returns(false).onSecondCall().returns(true);
        sandbox.stub(fs, 'appendFile').callsFake(((_path, _content, _option, cb) => {
            cb(null, Buffer.from(''));
        }) as any);

        await appendFile('test.txt', 'abc');
        expect(true).to.eq(true);
    });

    it('Remove file with error the path is required', async () => {
        const error: Error = await removeFile(' ').catch(error => error);
        expect(error.message).to.eq('The path is required!');
    });

    it('Remove file with file existed', async () => {
        sandbox.stub(fs, 'existsSync').returns(false);
        await removeFile('test.txt');
        expect(true).to.eq(true);
    });

    it('Remove file with error', async () => {
        sandbox.stub(fs, 'existsSync').returns(true);
        sandbox.stub(fs, 'unlink').callsFake(((_path, cb) => {
            cb(new Error());
        }) as any);

        const error: Error = await removeFile('test.txt').catch(error => error);
        expect(error.message).to.not.eq(undefined);
    });

    it('Remove file successful', async () => {
        sandbox.stub(fs, 'existsSync').returns(true);
        sandbox.stub(fs, 'unlink').callsFake(((_path, cb) => {
            cb(null);
        }) as any);

        await removeFile('test.txt');
        expect(true).to.eq(true);
    });
});
