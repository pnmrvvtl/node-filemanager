import { promises as fsPromises } from 'fs';
import path from 'path';

export const changeDirectory = async (currentDir, newPath) => {
  const resolvedPath = path.resolve(currentDir, newPath);
  try {
    const stats = await fsPromises.stat(resolvedPath);
    if (stats.isDirectory()) {
      return resolvedPath;
    } else {
      console.log('Operation failed');
    }
  } catch {
    console.log('Operation failed');
  }
  return currentDir;
};

export const listFiles = async (currentDir) => {
  try {
    const files = await fsPromises.readdir(currentDir);
    const fileStats = await Promise.all(files.map(async (file) => {
      const filePath = path.join(currentDir, file);
      const stats = await fsPromises.stat(filePath);
      return { name: file, isDir: stats.isDirectory() };
    }));

    const sortedFiles = fileStats.sort((a, b) => {
      if (a.isDir !== b.isDir) {
        return a.isDir ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    console.table(sortedFiles.map(f => ({
      Name: f.name,
      Type: f.isDir ? 'Directory' : 'File'
    })));
  } catch {
    console.log('Operation failed');
  }
};
