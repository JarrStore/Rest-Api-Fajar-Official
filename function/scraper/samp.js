const sampQuery = require('samp-query');

async function getServerStatus(ip, port) {
    return new Promise((resolve, reject) => {
        const options = {
            host: ip,
            port: parseInt(port, 10),
            timeout: 3000 // Menambah timeout agar lebih lama memberi kesempatan untuk merespons
        };

        sampQuery(options, (error, response) => {
            if (error) {
                // Menambahkan log error untuk debugging
                console.error("Error detail:", error);
                reject("Terjadi kesalahan saat menghubungi server."); // Pesan error lebih generik
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
