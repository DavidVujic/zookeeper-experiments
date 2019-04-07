const ZooKeeper = require('zookeeper');


function onData(client, rc, error, stat, data){
    if (data && data.toString() === client.client_id) {
        console.log('leader');
    }
}

function watcher(client, path, func, rc) {
    if (rc === -1) {
        checkMaster(client, path, func);
    } else if (rc === 2) {
        func(client, path);
    }
}

function checkMaster(client, path, func) {
    client.aw_get(path, watcher.bind(null, client, path, func), onData.bind(null, client));
}

function runForLeader(client, path) {
    client.a_create(path, `${client.client_id}`, ZooKeeper.ZOO_EPHEMERAL, (rc) => {
        if (rc === 0) {
            console.log('leader');
        } else {
            checkMaster(client, path, runForLeader);
        }
    });
}

function createClient() {
    return new ZooKeeper({
        connect: '127.0.0.1:2181',
        timeout: 5000,
        debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
        host_order_deterministic: false,
    });
}

function electLeader(path) {
    const client = createClient();

    client.on('connect', () => {
        console.log('connect');
        console.log(`session established, id=${client.client_id}`);
        runForLeader(client, path);
    });

    client.connect(() => {});
}

module.exports = {
    electLeader,
};
