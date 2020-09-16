const User = require('../models/user');
const Car = require('../models/car');
class userService {

    static myPassword(id) {
        return User.findOne({ _id: id }, { password: 1 })
    }
}
module.exports = userService;