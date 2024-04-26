import { spawn } from 'child_process';

// 定义一个函数用于执行命令
function runCommand(command, args, options = {}) {
  const spawnedProcess = spawn(command, args, { stdio: 'inherit', ...options });

  spawnedProcess.on('error', (err) => {
    console.error(`命令执行错误: ${err}`);
  });

  return spawnedProcess;
}

// 执行 "npx tailwindcss -i ./src/input.css -o ./src/output.css --watch"
const tailwindProcess = runCommand('npx', [
  'tailwindcss',
  '-i',
  './src/input.css',
  '-o',
  './src/output.css',
  '--watch',
]);

// 一旦设置了监听，可以开始第二个命令
// 执行 "dumi dev"
const dumiProcess = runCommand('dumi', ['dev']);

// 可选：也可以对这两个进程的退出进行监听处理
tailwindProcess.on('close', (code) => {
  console.log(`tailwindcss 进程退出，退出码: ${code}`);
});

dumiProcess.on('close', (code) => {
  console.log(`dumi 进程退出，退出码: ${code}`);
});
