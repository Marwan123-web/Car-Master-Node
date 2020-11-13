const mongoose = require('mongoose');
const imageSchema = mongoose.Schema({
    name: String,
    data: Buffer,
    contentType: String
});
module.exports = mongoose.model('image', imageSchema);