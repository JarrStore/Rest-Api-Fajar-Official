const { User } = require('./model');

async function cekKey(apikey) {
    let db = await User.findOne({ apikey: apikey });
    return db ? db.apikey : false;
}
