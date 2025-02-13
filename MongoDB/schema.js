const mongoose = require('mongoose'); // Menggunakan koneksi dari connect.js

const statsSchema = new mongoose.Schema({ // Pakai `new mongoose.Schema`
    totalRequests: { type: Number, default: 0 },
    totalPenggunaApikey: { type: Number, default: 0 }
}, { versionKey: false });

const Stats = mongoose.model('Stats', statsSchema); // Model harus dibuat dengan mongoose.model

module.exports = Stats;
