/* eslint-disable no-console */
const ZooKeeper = require('zookeeper');

const host = process.argv[2] || '127.0.0.1:2181';

let printIntervalId;
let updateDataIntervalId;

function shutDown() {
  clearInterval(printIntervalId);
  process.exit();
}

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);

function exists(client, node, callback) {
  client.aw_exists(node, (type, stat, path) => {
    if (type !== -1) {
      console.log('aw_exists WATCHER', 'type:', type, 'stat:', stat, 'path:', path);
      exists(client, node, callback);
    }
  }, (rc, error, stat) => {
    callback(stat.version);
    console.log('aw_exists CALLBACK', 'rc:', rc, 'error:', error);
  });
}

function connectClient() {
  let client = new ZooKeeper();
  let timeoutId;

  client.on('connect', () => {
    console.log('connect', `id=${client.client_id} state=${client.state}`);

    const path = '/hello';
    let version = 0;

    exists(client, path, (ver) => {
      console.log('current version is', version);
      version = ver;
    });

    updateDataIntervalId = setInterval(() => {
      client.a_set(path, `data is ${Date.now().toFixed()}`, version, () => {
        console.log('a_set callback');
      });
    }, 3000);

    clearTimeout(timeoutId);
  });

  client.on('connecting', () => {
    console.error('\x1b[36m', 'connecting', `id=${client.client_id} state=${client.state}`, '\x1b[0m');

    clearInterval(updateDataIntervalId);
    timeoutId = setTimeout(() => {
      client.close();
    }, 25000);
  });

  client.on('close', () => {
    console.error('\x1b[36m', 'close', `id=${client.client_id} state=${client.state}`, '\x1b[0m');

    client.removeAllListeners('connect');
    client.removeAllListeners('connecting');
    client.removeAllListeners('close');
    client = null;

    setTimeout(connectClient, 3000);
  });

  client.init({
    connect: host,
    timeout: 10000,
    debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
    host_order_deterministic: false,
  });
}

printIntervalId = setInterval(() => process.stdout.write('. '), 1000);

connectClient();
