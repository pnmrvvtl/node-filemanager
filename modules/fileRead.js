import { createReadStream } from 'fs';
import path from 'path';

export const readFile = (currentDir, filePath) => {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(currentDir, filePath);
    const readStream = createReadStream(fullPath, 'utf-8');

    readStream.on('data', (chunk) => {
      process.stdout.write(chunk);
    });

    readStream.on('end', () => {
      console.log();
      resolve();
    });

    readStream.on('error', (err) => {
      console.log('Operation failed');
      reject(err);
    });
  });
};
