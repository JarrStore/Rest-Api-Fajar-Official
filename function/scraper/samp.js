const sampQuery = require('samp-query');

async function getServerStatus(ip, port) {
    return new Promise((resolve, reject) => {
        const options = {
            host: ip,
            port: parseInt(port, 10),
            timeout: 3000
        };

        // Tes query sederhana tanpa retry atau delay tambahan
        sampQuery(options, (error, response) => {
            if (error) {
                console.error("Error detail:", error); // Lihat apakah ada detail error yang berguna
                reject("Terjadi kesalahan saat menghubungi server.");
            } else {
                const serverStatus = [
    "IP Server : ", options.host, ":", options.port, "\n",
    "Nama Server : ", response.hostname, "\n",
    "Pemain Online : ", response.online, "\n",
    "Max Pemain : ", response.maxplayers, "\n",
    "GameMode : ", response.gamemode, "\n",
    "Map : ", response.mapname, "\n",
    "Version : ", response.rules.version, "\n",
    "Weather : ", response.rules.weather, "\n",
    "Url : ", response.rules.weburl, "\n",
    "Time : ", response.rules.worldtime, "\n",
    "Player : ", response.players, "\n",
    "Status : Online ✅"
].join("");
                resolve(serverStatus);
            }
        });
    });
}

module.exports = getServerStatus;
