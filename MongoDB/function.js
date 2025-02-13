const Stats = require('./schema');

// **Fungsi cek API key**
function checkApikey(apikey) {
    return apikey === "fajarofficial"; // API key statis
}

// **Fungsi untuk menambah total request & pengguna API key**
async function updateStats() {
    let stats = await Stats.findOne();
    if (!stats) stats = new Stats();

    stats.totalRequests++;
    stats.totalPenggunaApikey++;
    await stats.save();

    return stats;
}

// **Fungsi mendapatkan status API**
async function getStats() {
    let stats = await Stats.findOne();
    if (!stats) stats = new Stats();
    return stats;
}

module.exports = { checkApikey, updateStats, getStats };
