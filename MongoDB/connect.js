const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://fajarshidik709:5xDc3VO36uCBZq5N@cluster0.qqz27.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
function connectMongoDb() {
    mongoose.connect(MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      console.log('[INFO] Connect to DB success!');
    });
};

module.exports.connectMongoDb = connectMongoDb
