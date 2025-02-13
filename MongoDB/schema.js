const mongoose = require('./connect'); // Menggunakan koneksi dari connect.js

const statsSchema = new mongoose.Schema({
    totalRequests: { type: Number, default: 0 },
    totalPenggunaApikey: { type: Number, default: 0 }
}, { versionKey: false });

const Stats = mongoose.model('Stats', statsSchema);

module.exports = Stats;
