const mongoose = require('mongoose');
const CONFIG = require('../config');
mongoose.Promise = global.Promise;
const uri = CONFIG.DB_CONFIG.connectionUrl;
let isConnected;
module.exports = connectToDatabase = () => {
if (isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }
  console.log('=> using new database connection');
  return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(db => {
    isConnected = db.connections[0].readyState;
  });
}