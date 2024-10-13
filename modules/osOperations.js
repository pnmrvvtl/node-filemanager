import { EOL, cpus, homedir, userInfo } from 'os';

export const osInfo = (option) => {
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
};
