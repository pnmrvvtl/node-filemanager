import { stdin as input, stdout as output } from 'process';
import readline from 'readline';
import { homedir } from 'os';
import { changeDirectory, listFiles } from './modules/navigation.js';
import { readFile } from './modules/fileRead.js';
import { writeFile } from './modules/fileWrite.js';
import { renameFile } from './modules/fileRename.js';
import { copyFile, moveFile, deleteFile } from './modules/fileCopyMove.js';
import { osInfo } from './modules/osOperations.js';
import { calculateHash, compressFile, decompressFile } from './modules/hashCompress.js';

const rl = readline.createInterface({ input, output });
let currentDir = homedir();

const { argv } = process;
const usernameArg = argv.find(arg => arg.startsWith('--username='));
const username = usernameArg ? usernameArg.split('=')[1] : 'Unknown User';

const printDirectory = () => {
  console.log(`You are currently in ${currentDir}`);
  rl.prompt();
};

const exitHandler = () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  rl.close();
};

const handleInput = async (line) => {
  const [command, ...args] = line.trim().split(' ');
  try {
    switch (command) {
      case 'up': currentDir = await changeDirectory(currentDir, '..'); break;
      case 'cd': currentDir = await changeDirectory(currentDir, args[0]); break;
      case 'ls': await listFiles(currentDir); break;
      case 'cat': await readFile(currentDir, args[0]); break;
      case 'add': await writeFile(currentDir, args[0], ''); break;
      case 'rn': await renameFile(currentDir, args[0], args[1]); break;
      case 'cp': await copyFile(currentDir, args[0], args[1]); break;
      case 'mv': await moveFile(currentDir, args[0], args[1]); break;
      case 'rm': await deleteFile(currentDir, args[0]); break;
      case 'os': osInfo(args[0]); break;
      case 'hash': await calculateHash(currentDir, args[0]); break;
      case 'compress': await compressFile(currentDir, args[0], args[1]); break;
      case 'decompress': await decompressFile(currentDir, args[0], args[1]); break;
      case '.exit': rl.close(); return;
      default:
        console.log('Invalid input');
        rl.prompt();
        return;
    }
  } catch {
    console.log('Operation failed');
  }
  printDirectory();
};

console.log(`Welcome to the File Manager, ${username}!`);
printDirectory();

rl.on('line', handleInput);
rl.on('close', exitHandler);
process.on('SIGINT', exitHandler);

rl.setPrompt('Input your command> ');
rl.prompt();