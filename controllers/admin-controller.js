const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const boolParser = require('express-query-boolean');
const express = require('express');
const app = express();
const upload = require("../middleware/upload");
const path = require("path");
app.use(boolParser());
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

const User = require('../models/user');
const Car = require('../models/car');

const adminService = require('../service/admin-service');
const possibleQueryVars = [
    'Kilometers',
    'Price',
    'Condition',
    'Brand',
    'Model',
    'Body'
];
// ---------------------Register----------------------
exports.Register = async (req, res, next) => { //[]
    try {
        const { firstName, lastName, email, password, phoneNumber, dataOfJoin } = req.body
        const hashedPassword = await hashPassword(password);
        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            res.status(400).json({ msg: 'This Email Has Been Used Before' })
        } else if (password.length < 8) {
            res.status(400).json({ msg: 'The Password Must Be Grater Than 8 Characters' })
        } else {
            const newUser = new User({ firstName, lastName, email, password: hashedPassword, phoneNumber, dataOfJoin });
            const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
            newUser.accessToken = accessToken;
            await newUser.save();
            res.status(200).json({ msg: 'Welcome', })
        }
    } catch (error) {
        next(error)
    }
}

// ---------------------Login----------------------
exports.login = async (req, res, next) => { //[]
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            const validPassword = await validatePassword(password, user.password);
            if (!validPassword) {
                res.status(400).json({ msg: 'ID or Password is not correct' });
            } else {
                const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                    expiresIn: "1d"
                });
                await User.findByIdAndUpdate(user._id, { accessToken }, { useFindAndModify: false })
                res.status(200).json(user);
            }

        } else if (!user) {
            res.status(400).json({ msg: 'ID or Password is not correct' });
        }
    } catch (error) {
        next(error);
    }
}
// ---------------------Profile----------------------
exports.profile = async (req, res, next) => { //[]
    let id = req.params.id;
    adminService.getMyData(id).then((data) => {
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ msg: 'Your Data Not Found' });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}

// --------------------update User by ID----------------------
exports.updateUser = async (req, res, next) => { //[]
    let id = req.params.id;
    try {
        let checkforUser = await User.findOne({
            _id: id
        });
        if (!checkforUser) {
            return res.status(400).json({
                icon: '&#xE5CD;',
                style: 'error',
                msg: "User Not Found"
            });
        } else {
            User.findOneAndUpdate({ _id: id },
                req.body, { useFindAndModify: false },
                (err) => {
                    if (err) {
                        res.status(404).json({ msg: "Can't Update this User Information" });
                    }
                    res.status(201).json({ msg: "User's Information Updated Successfuly" });
                });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Server");
    }
}

// --------------------Add Car----------------------
exports.addCar = async (req, res, next) => { //[]
    try {
        const { Title, Images, Kilometers, Price, Condition, PreviousOwners, InspectionNew, Warranty, FullService, NonSmokingVehicle, GearingType, EngineVolume, DriveChain, Cylinders, HorsePower, Torque
            , Fuel, Consumption, CO2Emission, EmissionClass, EmissionLabel
            , Brand, Model, FirstRegistration, BodyColor, PaintType, BodyColorOriginal, InteriorFittings, InteriorColors,
            Body, NrofDoors, NrofSeats, ModelCode, CountryVersion,
            ComfortAndConvenience, EntertainmentAndMedia, Extras, SafetyAndSecurity, Description, DateOfPost } = req.body

        const newCar = new Car({
            Title, Images, Kilometers, Price, Condition, PreviousOwners, InspectionNew, Warranty, FullService, NonSmokingVehicle, GearingType, EngineVolume, DriveChain, Cylinders, HorsePower, Torque
            , Fuel, Consumption, CO2Emission, EmissionClass, EmissionLabel
            , Brand, Model, FirstRegistration, BodyColor, PaintType, BodyColorOriginal, InteriorFittings, InteriorColors,
            Body, NrofDoors, NrofSeats, ModelCode, CountryVersion,
            ComfortAndConvenience, EntertainmentAndMedia, Extras, SafetyAndSecurity, Description, DateOfPost
        });
        await newCar.save();
        res.status(200).json({ msg: 'Car Added Successfuly' })

    } catch (error) {
        next(error)
    }
}
// ---------------------Get Car Data----------------------
exports.getCar = async (req, res, next) => { //[]
    let id = req.params.id;
    adminService.getCarData(id).then((data) => {
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ msg: 'Data Not Found' });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}
// ---------------------Get All Cars----------------------
exports.getCars = async (req, res, next) => { //[]
    adminService.getAllCars().then((data) => {
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ msg: 'Data Not Found' });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}
// ---------------------Get All Cars For Admin----------------------
exports.getCarsForAdmin = async (req, res, next) => { //[]
    adminService.getAllCarsForAdmin().then((data) => {
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ msg: 'Data Not Found' });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}
// ---------------------Delete Car----------------------
exports.deleteCar = async (req, res, next) => { //[]
    let id = req.params.id;
    adminService.deleteCar(id).then((car) => {
        if (car) {
            res.status(201).json({ msg: 'Car Deleted Successfuly' });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Internal Server Error" });
    });
}

// --------------------update User by ID----------------------
exports.updateCar = async (req, res, next) => { //[]
    let id = req.params.id;
    try {
        let checkforCar = await Car.findOne({
            _id: id
        });
        if (!checkforCar) {
            return res.status(400).json({
                icon: '&#xE5CD;',
                style: 'error',
                msg: "Car Not Found"
            });
        } else {
            Car.findOneAndUpdate({ _id: id },
                req.body, { useFindAndModify: false },
                (err) => {
                    if (err) {
                        res.status(404).json({ msg: "Can't Update this Car Information" });
                    }
                    res.status(201).json({ msg: "Car's Information Updated Successfuly" });
                });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Server");
    }
}
exports.increamentViews = async (req, res, next) => { //[]
    let id = req.params.id;
    adminService.increamentCarViews(id).then((car) => {
        if (car) {
            res.json({ msg: 'incremented' });
        } else {
            res.status(404).json({ msg: 'Data Not Found' });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}
exports.MostViewsCars = async (req, res, next) => { //[]
    adminService.getMostViewsCars().then((cars) => {
        if (cars) {
            res.json(cars);
        } else {
            res.status(404).json({ msg: 'Data Not Found' });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}
exports.RecentCars = async (req, res, next) => { //[]
    adminService.getlatestCars().then((cars) => {
        if (cars) {
            res.json(cars);
        } else {
            res.status(404).json({ msg: 'Data Not Found' });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}
// // ---------------------Get All Cars----------------------
// exports.searchForCars = async (req, res, next) => { //[]
//     adminService.getSearchCars().then((data) => {
//         if (data) {
//             res.json(data);
//         } else {
//             res.status(404).json({ msg: 'Data Not Found' });
//         }
//     }).catch(err => {
//         console.log(err);
//         res.status(500).json({ msg: 'Internal Server Error' });
//     })
// }

// ---------------------Add Car To Favourites----------------------
exports.addToFavourites = async (req, res, next) => {
    let id = req.params.id;
    let carId = req.params.carid;
    let checkforFavouriteCar = await User.findOne({
        _id: id,
    }, { favourites: { $elemMatch: { carId } } });
    if (checkforFavouriteCar.favourites.length > 0) {
        return res.status(400).json({
            icon: '&#xE5CD;',
            style: 'error',
            msg: "This Car Was Added Before To Favourites"
        });
    }
    else {
        adminService.addToFavourites(id, carId).then((car) => {
            if (car) {
                res.json({ msg: 'Car Added Successfuly To Favourites' });
            } else {
                res.status(404).json({ msg: 'Something Was Wrong' });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: 'Internal Server Error' });
        })
    }

}

// ---------------------Get All Cars----------------------
exports.filterCars = async (req, res, next) => { //[]
    const cardata = await Car.find({ Reserved: 'no' });
    let response = [];
    const q = req.query;
    if (!Object.keys(q).length) {
        response = cardata;
    } else {
        // NO arrow functions here, we are using “THIS”
        response = cardata.filter(function (cars) {
            return Object.keys(this).every((key) => cars[key] >= this[key])
        }, q);
    }
    res.json(response);
}
// --------------------------------------------------------------
exports.home = (req, res) => {
    return res.sendFile(path.join(`${__dirname}/../views/index.html`));
};
exports.multipleUpload = async (req, res) => {
    try {
        await upload(req, res);
        // console.log(req.files);

        if (req.files.length <= 0) {
            return res.send(`You must select at least 1 file.`);
        }

        return res.send(`Files has been uploaded.`);
    } catch (error) {
        // console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.send("Too many files to upload.");
        }
        return res.send(`Error when trying upload many files: ${error}`);
    }
};