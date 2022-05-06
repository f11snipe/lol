import os from 'os';
import fs from 'fs';
import path from 'path';
import net from 'net';
import tls from 'tls';
import tty from 'tty';
import colors from 'colors/safe';
import { spawn, spawnSync, SpawnOptionsWithoutStdio, ChildProcessWithoutNullStreams, execSync } from 'child_process';

// const ac = new AbortController();
// const signal = ac.signal;

// const args = [...process.argv];
// const arg1 = args.shift();
// const arg2 = args.shift();
// const arg3 = args.shift();

// lsattr
// chattr +i /root/king.txt
// mvxattr -d /root/koth -s /root/king.txt
// sudo install -m =xs $(which cp) .

// LFILE=file_to_change
// ./cp --attributes-only --preserve=all ./cp "$LFILE"


const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const handle = (line, cb) => {
  const args = line.trim().split(' ').map(p => p.trim());
  const cmd = args.shift();
  const res = spawn(cmd, args);

  res.stderr.on('data', (data) => {
    console.log(`STDERR: ${data}`);
  });

  res.stdout.on('data', (data) => {
    console.log(`STDOUT: ${data}`);
  });

  res.on('close', (code) => {
    console.log(`CLOSED: ${code}`);

    cb(code);
  });
};

const prompt = () => {
  readline.prompt();
  readline.question(`LOL > `, (line) => {
    const cmd = line.trim();

    if (/^exit$/i.test(cmd)) {
      console.log('LOL GOODBYE!');
      readline.close();
    } else {
      handle(line, (code) => {
        console.log(`HANDLED: [${code}] '${cmd}'`);
        prompt();
      });
    }
  });
};


process.stdin.on('keypress', (chunk, key) => {
  if (key && key.name === 'c' && key.ctrl) {
    console.log(`CTL+C: Goodbye`);
    console.log('GOTCHA! ... TRY AGAIN :)');
    prompt();
  }
});

process.stdin.setRawMode(true);

// if (args.length > 0) {
//   console.log('More args than expected:', args, process.argv);
// }

// if (arg3) {
//   const [cmd, ...rest] = arg3.trim().split(' ').map(a => a.trim());

//   spawn(cmd, rest, { stdio: 'inherit', cwd: '/lol' });
// } else {
//   console.log('lol wrapper', process.argv);
// }

// if (process.argv[2]) {
//   console.log(execSync(process.argv[2]).toString())
// } else {
//   console.log('sad day...');
// }

prompt();
