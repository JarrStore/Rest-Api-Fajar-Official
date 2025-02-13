const mongoose = require('mongoose');

const Users = mongoose.Schema({
    totalRequests: { type: Number, default: 0 },
    totalPenggunaApikey: { type: Number, default: 0 }
}, { versionKey: false });
module.exports.User = mongoose.model('api', Users);
