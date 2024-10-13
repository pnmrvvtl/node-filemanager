import { createReadStream } from 'fs';
import path from 'path';

// Read file content
export const readFile = async (currentDir, filePath) => {
  const fullPath = path.resolve(currentDir, filePath);
  const readStream = createReadStream(fullPath, 'utf-8');

  readStream.on('data', (chunk) => {
    process.stdout.write(chunk);
  });

  readStream.on('end', () => {
    console.log();
  });

  readStream.on('error', () => {
    console.log('Operation failed');
  });
};
