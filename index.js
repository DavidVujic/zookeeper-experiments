const { createNodes } = require('./setup.js');
const { electLeader } = require('./electleader.js');
const { createWorker } = require('./createWorker.js');
const { listen } = require('./addlistener.js');

const logger = require('./logger.js');
const notifier = require('./notifier.js');

notifier.on('connect', message => logger.log('connect', message));
notifier.on('createNode', message => logger.log('createNode', message));

notifier.on('onChildren', (children) => {
  children.forEach((child) => {
    logger.log(`child id: ${child}`);
  });
});

function setupMaster() {
  return new Promise((resolve) => {
    notifier.on('leader', resolve);

    electLeader('/lemaster');
  });
}

function setupWorker() {
  return new Promise((resolve) => {
    notifier.on('createWorker', resolve);

    createWorker();
  });
}

async function addListener(client, path) {
  listen(client, path);
}

async function addTask() {
  logger.log('TODO: add task');
}

async function init() {
  await createNodes(['/workers', '/assign', '/tasks', '/status']);

  const master = await setupMaster();
  await addListener(master, '/workers');

  setInterval(() => {
    setupWorker();
  }, 3000);
  // const worker = await setupWorker();

  // await addListener(worker);

  await addTask();
}

init().catch(logger.error);
