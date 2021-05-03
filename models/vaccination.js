const mongoose = require('mongoose');
const vaccination = new mongoose.Schema({
    count: Number
});

module.exports = Vaccination = mongoose.model('vaccination', vaccination);