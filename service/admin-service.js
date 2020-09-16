const User = require('../models/user');
const Car = require('../models/car');
class adminService {

    static getMyData(id) {
        return User.findOne({ _id: id }, { password: 0 })
    }
    static getCarData(id) {
        return Car.findOne({ _id: id })
    }
    static getAllCars() {
        return Car.find({ Reserved: 'no' })
    }
    static getAllCarsForAdmin() {
        return Car.find()
    }
    static deleteCar(id) {
        return Car.findOneAndDelete({ _id: id });
    }
    // static getSearchCars() {
    //     return Car.find()
    // }
    static async addToFavourites(id, carId) {
        var car = { carId };
        return User.findOne({ _id: id }).updateOne(
            {}, // your query, usually match by _id
            { $push: { favourites: car } }, // item(s) to match from array you want to pull/remove
            { multi: true } // set this to true if you want to remove multiple elements.
        );
    }
    static async increamentCarViews(id) {
        return Car.updateOne(
            { _id: id },
            { $inc: { Views: 1 } }
        )
    }
    static async getMostViewsCars() {
        return Car.aggregate([
            { $project: { Views: 1, Price: 1, Title: 1, Brand: 1, Model: 1 } },
            { $sort: { Views: -1 } },
        ]).limit(5);
    }
    // views: { $max: ["$Views"] },
    static async getlatestCars() {
        return Car.aggregate([
            { $project: { Views: 1, Price: 1, Title: 1, DateOfPost: 1, Brand: 1, Model: 1 } },
            { $sort: { DateOfPost: -1 } },
        ]).limit(5);
    }
}
module.exports = adminService;