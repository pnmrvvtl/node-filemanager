import {createReadStream, createWriteStream, promises as fsPromises} from 'fs';
import path from 'path';
import {pipeline} from 'stream/promises';

export const copyFile = async (currentDir, src, dest, moving = false) => {
  const srcPath = path.resolve(currentDir, src);
  const destPath = path.resolve(currentDir, dest);
  try {
    const readStream = createReadStream(srcPath);
    const writeStream = createWriteStream(destPath);
    await pipeline(readStream, writeStream);
    console.log(`File ${moving ? 'moved' : 'copied'} successfully`);
  } catch {
    console.log('Operation failed');
  }
};

export const moveFile = async (currentDir, src, dest) => {
  await copyFile(currentDir, src, dest, true);
  await deleteFile(currentDir, src, true);
};

export const deleteFile = async (currentDir, filePath, moving = false) => {
  const fullPath = path.resolve(currentDir, filePath);
  try {
    await fsPromises.unlink(fullPath);
    !moving && console.log('File deleted');
  } catch {
    console.log('Operation failed');
  }
};
