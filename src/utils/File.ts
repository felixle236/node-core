import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Get list directories into specified directory.
 * @param dir directory original
 */
export function getDirectories(dir: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(dir, undefined, (err, list) => {
      if (err) {
        return reject(err);
      }
      resolve(list.filter((item) => fs.statSync(path.join(dir, item)).isDirectory()));
    });
  });
}

/**
 * Get list directories synchronize into specified directory.
 * @param dir directory original
 */
export function getDirectoriesSync(dir: string): string[] {
  const list = fs.readdirSync(dir);
  return list.filter((item) => fs.statSync(path.join(dir, item)).isDirectory());
}

/**
 * Get list files into specified directory.
 * @param dir directory original
 */
export function getFiles(dir: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(dir, undefined, (err, list) => {
      if (err) {
        return reject(err);
      }
      resolve(list.filter((item) => !fs.statSync(path.join(dir, item)).isDirectory()));
    });
  });
}

/**
 * Get list files synchronize into specified directory.
 * @param dir directory original
 */
export function getFilesSync(dir: string): string[] {
  const list = fs.readdirSync(dir);
  return list.filter((item) => !fs.statSync(path.join(dir, item)).isDirectory());
}

/**
 * Search files with pattern.
 * @param pattern string
 */
export function searchFiles(pattern: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    glob(pattern, (err, matches) => {
      if (err) {
        return reject(err);
      }
      resolve(matches);
    });
  });
}

/**
 * Search files synchronize with pattern.
 * @param pattern string
 */
export function searchFilesSync(pattern: string): string[] {
  return glob.sync(pattern);
}

/**
 * Create directory into specified directory.
 * @param dir directory original
 */
export function createDirectory(dir: string): void {
  const splitPath = dir.split('/');
  if (splitPath.length > 10) {
    throw new Error('The path is invalid!');
  }

  splitPath.reduce((path, subPath) => {
    let currentPath;
    if (subPath !== '.') {
      currentPath = path + '/' + subPath;
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
      }
    } else {
      currentPath = subPath;
    }

    return currentPath;
  }, '');
}

/**
 * Read a file to buffer data.
 * @param filePath File's path
 */
export function readFile(filePath: string): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    if (!filePath || !filePath.trim()) {
      return reject(new Error('The path is required!'));
    }

    fs.readFile(filePath, undefined, (error, content) => {
      if (error) {
        return reject(error);
      }
      resolve(content);
    });
  });
}

/**
 * Read a file to text content.
 * @param filePath File's path
 */
export function readFileAsText(filePath: string, encoding = 'utf8'): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (!filePath || !filePath.trim()) {
      return reject(new Error('The path is required!'));
    }

    fs.readFile(filePath, { encoding } as fs.ObjectEncodingOptions, (error, content) => {
      if (error) {
        return reject(error);
      }
      resolve(content as string);
    });
  });
}

/**
 * Write a file with a path and content.
 * @param filePath File's path
 * @param content buffer data or text content
 * @param encoding data encoding
 */
export function writeFile(filePath: string, content: string | Buffer, encoding?: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!filePath || !filePath.trim()) {
      return reject(new Error('The path is required!'));
    }
    if (!content) {
      return reject(new Error('The content is required!'));
    }

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      createDirectory(dir);
    }

    fs.writeFile(filePath, content, { encoding } as fs.ObjectEncodingOptions, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

/**
 * Append a file with a path and content.
 * @param filePath File's path
 * @param content buffer data or text content
 * @param encoding data encoding
 */
export function appendFile(filePath: string, content: string | Buffer, encoding?: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!filePath || !filePath.trim()) {
      return reject(new Error('The path is required!'));
    }
    if (!content) {
      return reject(new Error('The content is required!'));
    }

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      createDirectory(dir);
    }

    fs.appendFile(filePath, content, { encoding } as fs.ObjectEncodingOptions, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

/**
 * Remove a file with a path.
 * @param filePath File's path
 */
export function removeFile(filePath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!filePath || !filePath.trim()) {
      return reject(new Error('The path is required!'));
    }

    if (!fs.existsSync(filePath)) {
      resolve();
    } else {
      fs.unlink(filePath, (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
    }
  });
}
