const config = require("./config.json");
const net = require("net");

const waitPorts = {};
console.log("[domi Port-Scanner] 시도할 포트를 확인하고 있습니다.");

for (let i = config.ports.min; i <= config.ports.max; i++) {
    waitPorts[i] = false;    
}
console.log(`[domi Port-Scanner] 총 ${Object.keys(waitPorts).length}개를 확인합니다.`);

function checkProcessPort() {
    const processCount = Object.values(waitPorts).reduce((prev, current) => current ? prev + 1 : prev, 0);
    if (processCount >= config.limit) return; // 너무 많아
    
    // 포트 고르기
    const portData = Object.entries(waitPorts).find(v => v[1] === false);
    if (portData === undefined) { // 이제 없음
        return;
    }

    const port = Number(portData[0]);
    waitPorts[port] = true; // 예약

    const client = net.connect({
        host: config.host,
        port,
        timeout: config.timeout
    });

    console.log(`[domi Port-Scanner] ${port} 연결중...`);

    client.on("connect", () => {
        client.end(); // 연결 끊음
        endConnect(port, true);
    });

    client.on("error", () => {
        endConnect(port, false);
    });

    setTimeout(() => {
        if (!client.destroyed || client.connecting) {
            client.destroy();
            endConnect(port, false);
        }
    }, config.timeout);
}

function endConnect(port, success) {
    console.log(`[domi Port-Scanner] ${port} ${success ? "\x1b[32m통과" : "\x1b[31m실패"}\x1b[0m`);

    delete waitPorts[port];
    checkProcessPort();
}

for (let i = 0; i < config.limit; i++) {
    checkProcessPort();
}