import { promises as fsPromises } from 'fs';
import path from 'path';

// Delete a file
export const deleteFile = async (currentDir, filePath) => {
  const fullPath = path.resolve(currentDir, filePath);
  try {
    await fsPromises.unlink(fullPath);
    console.log('File deleted');
  } catch {
    console.log('Operation failed');
  }
};
