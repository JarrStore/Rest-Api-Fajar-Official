const sampQuery = require('samp-query');

async function getServerStatus(ip, port) {
    return new Promise((resolve, reject) => {
        const options = {
            host: ip,
            port: parseInt(port, 10),
            timeout: 10000 // Waktu timeout lebih lama
        };

        sampQuery(options, (error, response) => {
            if (error) {
                // Menangkap dan mencetak seluruh objek error untuk analisis lebih lanjut
                console.error("Error details:", error); // Log error detail
                console.error("Stack trace:", error.stack); // Stack trace jika ada

                reject("Terjadi kesalahan saat menghubungi server.");
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
