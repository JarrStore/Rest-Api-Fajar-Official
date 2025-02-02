const sampQuery = require('samp-query');

async function getServerStatus(ip, port) {
    return new Promise((resolve, reject) => {
        const options = {
            host: ip,
            port: parseInt(port, 10),
            timeout: 5000 // Meningkatkan timeout lebih lama (5 detik)
        };

        sampQuery(options, (error, response) => {
            if (error) {
                // Cek tipe error dan beri log detail untuk diagnosis lebih lanjut
                console.error("Error details:", error);
                
                if (error.code === 'ETIMEOUT') {
                    reject("Server sedang offline atau tidak merespons dalam waktu yang ditentukan.");
                } else {
                    reject("Terjadi kesalahan saat menghubungi server.");
                }
            } else {
                const serverStatus = `
IP Server : ${options.host}:${options.port}
Nama Server : ${response.hostname}
Pemain Online : ${response.online}
Max Pemain : ${response.maxplayers}
GameMode : ${response.gamemode}
Map : ${response.mapname}
Version : ${response.rules.version}
Weather : ${response.rules.weather}
Url : ${response.rules.weburl}
Time : ${response.rules.worldtime}
Player : ${response.players}
Status : Online ✅
`;
                resolve(serverStatus);
            }
        });
    });
}

module.exports = getServerStatus;
