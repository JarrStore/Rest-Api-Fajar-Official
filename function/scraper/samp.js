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
                const serverData = {
    ip_server: `${options.host || "N/A"}:${options.port || "N/A"}`,
    nama_server: response.hostname || "N/A",
    pemain_online: response.online || 0,
    max_pemain: response.maxplayers || 0,
    game_mode: response.gamemode || "N/A",
    map: response.mapname || "N/A",
    version: response.rules.version || "N/A",
    weather: response.rules.weather || "N/A",
    url: response.rules.weburl || "N/A",
    world_time: response.rules.worldtime || "N/A",
    player_list: response.players.length > 0 
        ? response.players.map(player => player.name) 
        : ["Tidak ada pemain online"]
};
                resolve(serverStatus);
            }
        });
    });
}

module.exports = getServerStatus;
