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
                const serverStatus = 
  "IP Server :" + options.host + ":" + options.port + " " +
  "Nama Server :" + response.hostname + " " +
  "Pemain Online :" + response.online + " " +
  "Max Pemain :" + response.maxplayers + " " +
  "GameMode :" + response.gamemode + " " +
  "Map :" + response.mapname + " " +
  "Version :" + response.rules.version + " " +
  "Weather :" + response.rules.weather + " " +
  "Url :" + response.rules.weburl + " " +
  "Time :" + response.rules.worldtime + " " +
  "Player :" + response.players + " " +
  "Status : Online ✅";
                resolve(serverStatus);
            }
        });
    });
}

module.exports = getServerStatus;
