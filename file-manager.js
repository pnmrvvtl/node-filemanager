import { createReadStream, createWriteStream, promises as fsPromises } from 'fs';
import { EOL, cpus, homedir, userInfo } from 'os';
import path from 'path';
import { stdin as input, stdout as output } from 'process';
import readline from 'readline';
import { pipeline } from 'stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import crypto from 'crypto';

const rl = readline.createInterface({ input, output });
let currentDir = homedir();

const { argv } = process;
const usernameArg = argv.find(arg => arg.startsWith('--username='));
const username = usernameArg ? usernameArg.split('=')[1] : userInfo().username;

const printDirectory = () => {
  console.log(`You are currently in ${currentDir}`);
  rl.prompt();
};

const exitHandler = () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  rl.close();
};

const changeDirectory = async (newPath) => {
  const resolvedPath = path.resolve(currentDir, newPath);
  try {
    const stats = await fsPromises.stat(resolvedPath);
    if (stats.isDirectory()) {
      currentDir = resolvedPath;
    } else {
      console.log('Operation failed');
    }
  } catch {
    console.log('Operation failed');
  }
  printDirectory();
};

const listFiles = async () => {
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
  printDirectory();
};

const readFile = async (filePath) => {
  const fullPath = path.resolve(currentDir, filePath);
  const readStream = createReadStream(fullPath, 'utf-8');

  readStream.on('data', (chunk) => {
    process.stdout.write(chunk);
  });

  readStream.on('end', () => {
    console.log();
    rl.prompt();
  });

  readStream.on('error', () => {
    console.log('Operation failed');
    rl.prompt();
  });
};

const writeFile = async (filePath) => {
  const fullPath = path.resolve(currentDir, filePath);
  rl.question('Enter the content to append:\n', async (content) => {
    try {
      const writeStream = createWriteStream(fullPath, { flags: 'a' });
      writeStream.write(content + EOL);
      writeStream.end();
      writeStream.on('finish', () => {
        console.log('File updated');
        rl.prompt();
      });
    } catch {
      console.log('Operation failed');
      rl.prompt();
    }
  });
};

const renameFile = async (oldPath, newPath) => {
  const oldFullPath = path.resolve(currentDir, oldPath);
  const newFullPath = path.resolve(currentDir, newPath);
  try {
    await fsPromises.rename(oldFullPath, newFullPath);
    console.log('File renamed');
  } catch {
    console.log('Operation failed');
  }
  printDirectory();
};

const copyFile = async (src, dest) => {
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
  printDirectory();
};

const moveFile = async (src, dest) => {
  await copyFile(src, dest);
  await deleteFile(src);
};

const deleteFile = async (filePath) => {
  const fullPath = path.resolve(currentDir, filePath);
  try {
    await fsPromises.unlink(fullPath);
    console.log('File deleted');
  } catch {
    console.log('Operation failed');
  }
  printDirectory();
};

const osInfo = (option) => {
  switch (option.toLowerCase()) {
    case '--eol': console.log(JSON.stringify(EOL)); break;
    case '--cpus':
      const cpuInfo = cpus().map((cpu) => ({
        Model: cpu.model,
        SpeedGHz: (cpu.speed / 1000).toFixed(2)
      }));
      console.log(`Total CPUs: ${cpus().length}`, cpuInfo);
      break;
    case '--homedir': console.log(homedir()); break;
    case '--username': console.log(userInfo().username); break;
    case '--architecture': console.log(process.arch); break;
    default: console.log('Invalid OS option');
  }
  printDirectory();
};

const calculateHash = async (filePath) => {
  const fullPath = path.resolve(currentDir, filePath);
  try {
    const hash = crypto.createHash('sha256');
    const input = createReadStream(fullPath);

    input.on('data', (chunk) => {
      hash.update(chunk);
    });

    input.on('end', () => {
      console.log(`Hash: ${hash.digest('hex')}`);
      printDirectory();
    });

    input.on('error', () => {
      console.log('Operation failed');
      printDirectory();
    });
  } catch {
    console.log('Operation failed');
    printDirectory();
  }
};


const compressFile = async (src, dest) => {
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
  printDirectory();
};

const decompressFile = async (src, dest) => {
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
  printDirectory();
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
      case 'rn': await renameFile(args[0], args[1]); break;
      case 'cp': await copyFile(args[0], args[1]); break;
      case 'mv': await moveFile(args[0], args[1]); break;
      case 'rm': await deleteFile(args[0]); break;
      case 'os': osInfo(args[0]); break;
      case 'hash': await calculateHash(args[0]); break;
      case 'compress': await compressFile(args[0], args[1]); break;
      case 'decompress': await decompressFile(args[0], args[1]); break;
      case '.exit': rl.close(); return;
      default:
        console.log('Invalid input');
        rl.prompt();
        return;
    }
  } catch {
    console.log('Operation failed');
  }
};

console.log(`Welcome to the File Manager, ${username}!`);
printDirectory();

rl.on('line', handleInput);
rl.on('close', exitHandler);
process.on('SIGINT', exitHandler);

rl.setPrompt('Input your command> ');
rl.prompt();
