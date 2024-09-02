const config = require("./config.json");
const net = require("net");

const waitPorts = {};
console.log("[domi Port-Scanner] 시도할 포트를 확인하고 있습니다.");

for (let i = config.ports.min; i <= config.ports.max; i++) {
    waitPorts[i] = false;    
}
console.log(`[domi Port-Scanner] 총 ${Object.keys(waitPorts).length}개를 확인합니다.`);