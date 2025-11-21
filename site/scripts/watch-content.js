const chokidar = require('chokidar');
const {WebSocketServer} = require('ws');
const chalk = require('chalk');
const path = require('path');

const wss = new WebSocketServer({port: 3001});
const clients = new Set();

wss.on('connection', (ws) => {
  console.log(chalk.green('Client connected'));
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

function notifyClients(filePath) {
  console.log(chalk.yellow(`File changed: ${filePath}`));
  clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({type: 'reload', file: filePath}));
    }
  });
}

const contentPath = path.resolve(process.cwd(), 'src/content');
const normalizedContentPath = contentPath.replace(/\\/g, '/'); // Normalize path separators for Windows

console.log(chalk.blue(`Watching: ${normalizedContentPath}`));

const watcher = chokidar.watch(normalizedContentPath, {
  ignoreInitial: false,
  persistent: true,
  usePolling: true, // ← 最关键
  interval: 80,
  atomic: true,
});

// Avoid triggering reloads for the initial file scan.
let isReady = false;

function isMarkdown(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.md' || ext === '.mdx';
}

watcher
  .on('add', (filePath) => {
    if (!isMarkdown(filePath)) {
      return;
    }
    if (isReady) {
      notifyClients(filePath);
    }
  })
  .on('change', (filePath) => {
    if (!isMarkdown(filePath)) {
      return;
    }
    notifyClients(filePath);
  })
  .on('unlink', (filePath) => {
    if (!isMarkdown(filePath)) {
      return;
    }
    console.log(chalk.gray(`File removed: ${filePath}`));
    if (isReady) {
      notifyClients(filePath);
    }
  })
  .on('ready', () => {
    isReady = true;
    console.log(chalk.blue('✓ Watching content files...'));
  })
  .on('error', (error) => {
    console.error(chalk.red('Watcher error:'), error);
  });
