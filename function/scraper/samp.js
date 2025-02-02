const sampQuery = require('samp-query');

async function getServerStatus(ip, port) {
    return new Promise((resolve, reject) => {
        const options = {
            host: ip,
            port: parseInt(port, 10), // Pastikan port dalam bentuk angka
            timeout: 1000
        };

        sampQuery(options, (error, response) => {
            if (error) {
                resolve(`Server sedang offline atau tidak merespons.`);
            } else {
                const serverStatus = `
IP Server : ${response.host}:${response.port} Nama Server : ${response.hostname} Pemain Online : ${response.online} Max Pemain : ${response.maxplayers} GameMode : ${response.gamemode} Map : ${response.mapname} Version : ${response.rules.version} Weather : ${response.rules.weather} Url : ${response.rules.weburl} Time :  ${response.rules.worldtime} Player : ${response.players} Status : Online ✅
`;
                resolve(serverStatus);
            }
        });
    });
}

module.exports = getServerStatus
