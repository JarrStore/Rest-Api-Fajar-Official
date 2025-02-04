const sampQuery = require('samp-query');

async function getServerStatus(ip, port) {
    return new Promise((resolve, reject) => {
        const options = {
            host: ip,
            port: parseInt(port, 10),
            timeout: 1000
        };

        // Tes query sederhana tanpa retry atau delay tambahan
        sampQuery(options, (error, response) => {
            if (error) {
                console.error("Error detail:", error); // Lihat apakah ada detail error yang berguna
                reject("Terjadi kesalahan saat menghubungi server.");
            } else {
                const serverStatus = `IPServer: ${options.host}:${options.port} NamaServer: ${response.hostname} PemainOnline: ${response.online} MaxPemain: ${response.maxplayers} GameMode: ${response.gamemode} Map: ${response.mapname} Version: ${response.rules.version} Weather: ${response.rules.weather} Url: ${response.rules.weburl} Time: ${response.rules.worldtime} Player: ${response.players.map(player => player.name).join(", ")}`;
                resolve(serverStatus);
            }
        });
    });
}

module.exports = getServerStatus;
