const mongoose = require('mongoose');
const { stringify } = require('querystring');
const userSchema = mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String, min: 8 },
    role: { type: String, default: 'normal', enum: ["normal", "admin"] },
    phoneNumber: { type: Number },
    dataOfJoin: { type: String },
    accessToken: { type: String },
    favourites: [
        {
            carId: { type: String },
        }
    ]
    // firstName lastName email password phoneNumber dataOfJoin role favourites
});


module.exports = mongoose.model('user', userSchema);