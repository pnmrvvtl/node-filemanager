import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { pipeline } from 'stream/promises';

export const calculateHash = async (currentDir, filePath) => {
  const fullPath = path.resolve(currentDir, filePath);
  try {
    const hash = crypto.createHash('sha256');
    const input = createReadStream(fullPath);

    return new Promise((resolve, reject) => {
      input.on('data', (chunk) => {
        hash.update(chunk);
      });

      input.on('end', () => {
        console.log(`Hash: ${hash.digest('hex')}`);
        resolve();
      });

      input.on('error', () => {
        console.log('Operation failed');
        reject();
      });
    });
  } catch {
    console.log('Operation failed');
  }
};

export const compressFile = async (currentDir, src, dest) => {
  const srcPath = path.resolve(currentDir, src);
  const destPath = path.resolve(currentDir, dest);
  const readStream = createReadStream(srcPath);
  const writeStream = createWriteStream(destPath);
  const brotli = createBrotliCompress();
  try {
    await pipeline(readStream, brotli, writeStream);
    console.log('File compressed');
  } catch {
    console.log('Operation failed');
  }
};

export const decompressFile = async (currentDir, src, dest) => {
  const srcPath = path.resolve(currentDir, src);
  const destPath = path.resolve(currentDir, dest);
  const readStream = createReadStream(srcPath);
  const writeStream = createWriteStream(destPath);
  const brotli = createBrotliDecompress();
  try {
    await pipeline(readStream, brotli, writeStream);
    console.log('File decompressed');
  } catch {
    console.log('Operation failed');
  }
};
