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

                const serverIP = response.options.host;
                  const serverPort = reponse.options.port
                  const gamemode = response.gamemode;
                  const PlayerOnline = response.online;
                  const maxPlayers = response.maxplayers;
                  const hostname = response.hostname;
                  const lagCompensation = response.rules.lagcomp;
                  const mapName = response.mapname;
                  const version = response.rules.version;
                  const weather = response.rules.weather;
                  const webUrl = response.rules.weburl;
                  const worldTime = response.rules.worldtime;
                  const players = response.players.map(player => player.name).join(", ") || "Tidak ada pemain";

            // Gabungkan semua informasi
            const serverStatus = `IPServer: ${serverIP}:${serverPort} NamaServer: ${hostname} PemainOnline: ${playerOnline} MaxPemain: ${maxPlayers} GameMode: ${gamemode} Map: ${mapName} Version: ${version} Weather: ${weather} Url: ${webUrl} Time: ${worldTime} Player: ${players}`;

            resolve(serverStatus);
        });
    });
}

module.exports = getServerStatus;
