const mongoose = require('./connect');

const statsSchema = new mongoose.Schema({
    totalRequests: { type: Number, default: 0 },
    totalPenggunaApikey: { type: Number, default: 0 }
});

const Stats = mongoose.model("Stats", statsSchema);

module.exports = Stats;
