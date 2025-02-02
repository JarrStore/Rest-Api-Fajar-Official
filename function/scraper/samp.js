const axios = require('axios');

async function getServerStatus(ip, port) {
    try {
        const response = await axios.get(`http://${ip}:${port}/status`);
        return `
IP Server : ${ip}:${port}
Nama Server : ${response.data.hostname}
Pemain Online : ${response.data.online}
Max Pemain : ${response.data.maxplayers}
GameMode : ${response.data.gamemode}
Map : ${response.data.mapname}
Version : ${response.data.version}
Weather : ${response.data.weather}
Url : ${response.data.url}
Time : ${response.data.worldtime}
Player : ${response.data.players}
Status : Online ✅
        `;
    } catch (error) {
        console.error("Error details:", error);
        return "Terjadi kesalahan saat menghubungi server.";
    }
}

module.exports = getServerStatus;
