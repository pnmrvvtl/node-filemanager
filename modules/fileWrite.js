import { createWriteStream } from 'fs';
import path from 'path';
import { EOL } from 'os';

export const writeFile = (currentDir, filePath, content) => {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(currentDir, filePath);
    const writeStream = createWriteStream(fullPath, { flags: 'a' });

    writeStream.write(content + EOL);
    writeStream.end();

    writeStream.on('finish', () => {
      console.log('File created successfully');
      resolve();
    });

    writeStream.on('error', (err) => {
      console.log('Operation failed');
      reject(err);
    });
  });
};
