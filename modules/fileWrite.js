import { createWriteStream } from 'fs';
import path from 'path';
import { EOL } from 'os';

// Write content to file
export const writeFile = async (currentDir, filePath, content) => {
  const fullPath = path.resolve(currentDir, filePath);
  const writeStream = createWriteStream(fullPath, { flags: 'a' });

  writeStream.write(content + EOL);
  writeStream.end();

  writeStream.on('finish', () => {
    console.log('File updated');
  });

  writeStream.on('error', () => {
    console.log('Operation failed');
  });
};
