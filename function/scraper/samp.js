const sampQuery = require('samp-query');

async function getServerStatus(ip, port) {
    return new Promise((resolve, reject) => {
        const options = {
            host: ip,
            port: parseInt(port, 10),
            timeout: 3000
        };

        // Menjalankan query ke server SAMP
        sampQuery(options, (error, response) => {
            if (error) {
                console.error("Error detail:", error);
                return reject("Terjadi kesalahan saat menghubungi server.");
            }

            // Pastikan response memiliki data sebelum mengaksesnya
            if (!response) {
                return reject("Tidak ada respons dari server.");
            }

            // Ambil data dari response
            const serverIP = options.host;
            const serverPort = options.port;
            const gamemode = response.gamemode || "Tidak diketahui";
            const playerOnline = response.online || 0;
            const maxPlayers = response.maxplayers || 0;
            const hostname = response.hostname || "Tidak diketahui";
            const lagCompensation = response.rules?.lagcomp || "Tidak diketahui";
            const mapName = response.mapname || "Tidak diketahui";
            const version = response.rules?.version || "Tidak diketahui";
            const weather = response.rules?.weather || "Tidak diketahui";
            const webUrl = response.rules?.weburl || "Tidak diketahui";
            const worldTime = response.rules?.worldtime || "Tidak diketahui";

            // Ambil daftar pemain jika ada
            const players = response.players?.map(player => player.name).join(", ") || "Tidak ada pemain";

            // Gabungkan semua informasi
            const serverStatus = `IPServer: ${serverIP}:${serverPort} NamaServer: ${hostname} PemainOnline: ${playerOnline} MaxPemain: ${maxPlayers} GameMode: ${gamemode} Map: ${mapName} Version: ${version} Weather: ${weather} Url: ${webUrl} Time: ${worldTime} Player: ${players}`;

            resolve(serverStatus);
        });
    });
}

module.exports = getServerStatus;
