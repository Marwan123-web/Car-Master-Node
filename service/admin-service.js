const User = require('../models/user');
const Car = require('../models/car');
class adminService {

    static getMyData(id) {
        return User.findOne({ _id: id }, { password: 0 })
    }

    static getMyPassword(id) {
        return User.findOne({ _id: id })
    }

    static getCarData(id) {
        return Car.findOne({ _id: id })
    }

    static getAllCars() {
        return Car.find()
    }

    static getAllNewCars() {
        return Car.find({ Condition: "New" })
    }

    static getAllUsedCars() {
        return Car.find({ Condition: { $ne: "New" } })
    }

    // static getAllCarsForAdmin() {
    //     return Car.find()
    // }

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
    static async deleteFromFavourites(id, carId) {
        var car = { carId };
        return User.findOne({ _id: id }).updateOne(
            {}, // your query, usually match by _id
            { $pull: { favourites: car } }, // item(s) to match from array you want to pull/remove
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
            { $project: { Views: 1, Price: 1, Title: 1, Brand: 1, Model: 1, Images: 1 } },
            { $sort: { Views: -1 } },
        ]).limit(5);
    }

    static async getAllMostViewsCars() {
        return Car.aggregate([
            { $project: { Views: 1, Price: 1, Title: 1, Brand: 1, Model: 1, Images: 1 } },
            { $sort: { Views: -1 } },
        ]);
    }
    // views: { $max: ["$Views"] },
    static async getlatestCars() {
        return Car.aggregate([
            { $project: { Views: 1, Price: 1, Title: 1, DateOfPost: 1, Brand: 1, Model: 1, Images: 1 } },
            { $sort: { DateOfPost: -1 } },
        ]).limit(5);
    }

    static async updatePassword(id, newpassword) {
        return User.updateOne({ _id: id }, {
            $set: {
                password: newpassword
            }
        })
    }

    static async pushCarPhoto(DateOfPost, photo) {
        return Car.findOne({ DateOfPost }).updateOne(
            {}, // your query, usually match by _id
            { $push: { Images: photo } }, // item(s) to match from array you want to pull/remove
            { multi: true } // set this to true if you want to remove multiple elements.
        );
    }

    static async getMyFavourties(id) {
        return User.findOne({ _id: id }, { "favourites.carId": 1 })
    }

}
module.exports = adminService;