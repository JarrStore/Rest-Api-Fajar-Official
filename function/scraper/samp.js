const sampQuery = require('samp-query');

async function getServerStatus(ip, port) {
    return new Promise((resolve, reject) => {
        const options = {
            host: ip,
            port: parseInt(port, 10),
            timeout: 1000
        };

                  let serverIP = response.options.serverip;
                  let serverPort = reponse.options.port
                  let gamemode = response.gamemode;
                  let PlayerOnline = response.online;
                  let maxPlayers = response.maxplayers;
                  let hostname = response.hostname;
                  let lagCompensation = response.rules.lagcomp;
                  let mapName = response.mapname;
                  let version = response.rules.version;
                  let weather = response.rules.weather;
                  let webUrl = response.rules.weburl;
                  let worldTime = response.rules.worldtime;

        // Tes query sederhana tanpa retry atau delay tambahan
        sampQuery(options, (error, response) => {
            if (error) {
                console.error("Error detail:", error); // Lihat apakah ada detail error yang berguna
                reject("Terjadi kesalahan saat menghubungi server.");
            } else {
                const serverStatus = `IPServer: ${serverIP}:${serverPort} NamaServer: ${hostname} PemainOnline: ${PlayerOnline} MaxPemain: ${maxPlayers} GameMode: ${gamemode} Map: ${mapName} Version: ${version} Weather: ${weather} Url: ${webUrl} Time: ${worldTime} Player: ${response.players.map(player => player.name).join(", ")}`;
                resolve(serverStatus);
            }
        });
    });
}

module.exports = getServerStatus;
