const mongoose = require('mongoose');

const Users = mongoose.Schema({
    apikey: { type: String }
}, { versionKey: false });

module.exports.User = mongoose.model('api', Users);
