import { createReadStream, createWriteStream, promises as fsPromises } from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

// Copy a file
export const copyFile = async (currentDir, src, dest) => {
  const srcPath = path.resolve(currentDir, src);
  const destPath = path.resolve(currentDir, dest);
  try {
    const readStream = createReadStream(srcPath);
    const writeStream = createWriteStream(destPath);
    await pipeline(readStream, writeStream);
    console.log('File copied');
  } catch {
    console.log('Operation failed');
  }
};

// Move a file
export const moveFile = async (currentDir, src, dest) => {
  await copyFile(currentDir, src, dest);
  await deleteFile(currentDir, src);
};

// Delete a file (used in moveFile)
export const deleteFile = async (currentDir, filePath) => {
  const fullPath = path.resolve(currentDir, filePath);
  try {
    await fsPromises.unlink(fullPath);
    console.log('File deleted');
  } catch {
    console.log('Operation failed');
  }
};
