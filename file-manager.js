import { createReadStream, createWriteStream, promises as fsPromises } from 'fs';
import { EOL, cpus, homedir, userInfo } from 'os';
import path from 'path';
import { stdin as input, stdout as output } from 'process';
import readline from 'readline';
import { pipeline } from 'stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';

const rl = readline.createInterface({ input, output });
let currentDir = homedir();

const printDirectory = () => {
  console.log(`You are currently in ${currentDir}`);
};

const exitHandler = () => {
  console.log(`Thank you for using File Manager, ${userInfo().username}!`);
  rl.close();
};

const changeDirectory = async (newPath) => {
  const resolvedPath = path.resolve(currentDir, newPath);
  const stats = await fsPromises.stat(resolvedPath);
  if (stats.isDirectory()) {
    currentDir = resolvedPath;
    printDirectory();
  } else {
    console.log('Operation failed');
  }
};

const listFiles = async () => {
  const files = await fsPromises.readdir(currentDir);
  const sortedFiles = await Promise.all(files.map(async (file) => {
    const filePath = path.join(currentDir, file);
    const stats = await fsPromises.stat(filePath);
    return { name: file, isDir: stats.isDirectory() };
  }));
  sortedFiles.sort((a, b) => a.isDir - b.isDir || a.name.localeCompare(b.name));
  console.table(sortedFiles.map(f => ({ Name: f.name, Type: f.isDir ? 'Directory' : 'File' })));
};

const readFile = async (filePath) => {
  const fullPath = path.resolve(currentDir, filePath);
  const readStream = createReadStream(fullPath, 'utf-8');
  readStream.pipe(output);
};

const writeFile = async (filePath) => {
  const fullPath = path.resolve(currentDir, filePath);
  const writeStream = createWriteStream(fullPath, { flags: 'a' });
  rl.question('Enter the content to append:\n', async (content) => {
    writeStream.write(content + EOL);
    writeStream.end();
    console.log('File updated');
  });
};

const copyFile = async (src, dest) => {
  const srcPath = path.resolve(currentDir, src);
  const destPath = path.resolve(currentDir, dest);
  const readStream = createReadStream(srcPath);
  const writeStream = createWriteStream(destPath);
  await pipeline(readStream, writeStream);
  console.log('File copied');
};

const moveFile = async (src, dest) => {
  await copyFile(src, dest);
  await deleteFile(src);
};

const deleteFile = async (filePath) => {
  const fullPath = path.resolve(currentDir, filePath);
  await fsPromises.unlink(fullPath);
  console.log('File deleted');
};

const osInfo = (option) => {
  switch (option) {
    case '--EOL': console.log(JSON.stringify(EOL)); break;
    case '--cpus': console.log(cpus()); break;
    case '--homedir': console.log(homedir()); break;
    case '--username': console.log(userInfo().username); break;
    case '--architecture': console.log(process.arch); break;
    default: console.log('Invalid OS option');
  }
};

const compressFile = async (src, dest) => {
  const srcPath = path.resolve(currentDir, src);
  const destPath = path.resolve(currentDir, dest);
  const readStream = createReadStream(srcPath);
  const writeStream = createWriteStream(destPath);
  const brotli = createBrotliCompress();
  await pipeline(readStream, brotli, writeStream);
  console.log('File compressed');
};

const decompressFile = async (src, dest) => {
  const srcPath = path.resolve(currentDir, src);
  const destPath = path.resolve(currentDir, dest);
  const readStream = createReadStream(srcPath);
  const writeStream = createWriteStream(destPath);
  const brotli = createBrotliDecompress();
  await pipeline(readStream, brotli, writeStream);
  console.log('File decompressed');
};

const handleInput = async (line) => {
  const [command, ...args] = line.trim().split(' ');
  try {
    switch (command) {
      case 'up': await changeDirectory('..'); break;
      case 'cd': await changeDirectory(args[0]); break;
      case 'ls': await listFiles(); break;
      case 'cat': await readFile(args[0]); break;
      case 'add': await writeFile(args[0]); break;
      case 'rn': await fsPromises.rename(path.resolve(currentDir, args[0]), path.resolve(currentDir, args[1])); console.log('File renamed'); break;
      case 'cp': await copyFile(args[0], args[1]); break;
      case 'mv': await moveFile(args[0], args[1]); break;
      case 'rm': await deleteFile(args[0]); break;
      case 'os': osInfo(args[0]); break;
      case 'compress': await compressFile(args[0], args[1]); break;
      case 'decompress': await decompressFile(args[0], args[1]); break;
      case '.exit': exitHandler(); break;
      default: console.log('Invalid input');
    }
  } catch (err) {
    console.log('Operation failed');
  }
};

printDirectory();

rl.on('line', handleInput);
rl.on('close', exitHandler);
