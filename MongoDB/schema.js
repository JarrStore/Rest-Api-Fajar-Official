const mongoose = require('mongoose');

const Stats = mongoose.Schema({
    totalRequests: { type: Number, default: 0 },
    totalPenggunaApikey: { type: Number, default: 0 }
}, { versionKey: false });
module.exports.Stats = mongoose.model('api', Stats);
