import { promises as fsPromises } from 'fs';
import path from 'path';

export const renameFile = async (currentDir, oldPath, newPath) => {
  const oldFullPath = path.resolve(currentDir, oldPath);
  const newFullPath = path.resolve(currentDir, newPath);
  try {
    await fsPromises.rename(oldFullPath, newFullPath);
    console.log('File renamed');
  } catch {
    console.log('Operation failed');
  }
};
