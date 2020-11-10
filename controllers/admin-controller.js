const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const boolParser = require('express-query-boolean');
const express = require('express');
const app = express();
const upload = require("../middleware/upload");
const uploadController = require('../middleware/uploadwithresize');
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const fs = require('fs');
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
            res.status(200).json({ msg: 'Welcome' })
        }
    } catch (error) {
        next(error)
    }
}

exports.ComparePassword = async (req, res, next) => { //[]
    let id = req.params.id;
    let password = req.params.password;
    let user = await User.findOne({ _id: id });
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) {
        res.status(400).json({ msg: 'ID or Password is not correct' });
    }
    else {
        res.status(200).json(user);
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
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}
// ---------------------Password----------------------
exports.Password = async (req, res, next) => { //[]
    let id = req.params.id;
    adminService.getMyPassword(id).then((data) => {
        if (data) {
            data.password
            res.json(data);
        } else {
            res.status(404).json({ msg: 'Your Data Not Found' });
        }
    }).catch(err => {
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}

// --------------------update User by ID----------------------
exports.updateEmail = async (req, res, next) => { //[]
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
                        res.status(404).json({ msg: "Can't Update Your Email" });
                    }
                    res.status(201).json({ msg: "Email Updated Successfuly" });
                });
        }
    } catch (err) {
        res.status(500).send("Error in Server");
    }
}
exports.updatePassword = async (req, res, next) => { //[]
    let id = req.params.id;
    let newpassword = req.body.password;
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
            const hashedPassword = await hashPassword(newpassword);
            adminService.updatePassword(id, hashedPassword).then((data) => {
                if (data) {
                    res.status(201).json({ msg: "Your Password Updated Successfuly" });
                } else {
                    res.status(404).json({ msg: "Can't Update Your Password" });
                }
            }).catch(err => {
                res.status(500).json({ msg: 'Internal Server Error' });
            })
        }
    } catch (err) {
        res.status(500).send("Error in Server");
    }
}
// --------------------Add Car----------------------
exports.addNewCar = async (req, res, next) => { //[]
    try {
        const { Title, Kilometers, Price, Condition, PreviousOwners,
            NextInspection, Warranty, FullService, NonSmokingVehicle, GearingType, EngineVolume,
            DriveChain, Cylinders, HorsePower, Torque
            , Fuel, Consumption, CO2Emission, EmissionClass, EmissionLabel
            , Brand, Model, FirstRegistration, BodyColor, PaintType, BodyColorOriginal, InteriorFittings, InteriorColors,
            Body, NrofDoors, NrofSeats, ModelCode, CountryVersion,
            ComfortAndConvenience, EntertainmentAndMedia, Extras, SafetyAndSecurity, Description, DateOfPost } = req.body;
        const newCar = new Car({
            Title, Kilometers, Price, Condition, PreviousOwners, NextInspection, Warranty, FullService, NonSmokingVehicle, GearingType, EngineVolume, DriveChain, Cylinders, HorsePower, Torque
            , Fuel, Consumption, CO2Emission, EmissionClass, EmissionLabel
            , Brand, Model, FirstRegistration, BodyColor, PaintType, BodyColorOriginal, InteriorFittings, InteriorColors,
            Body, NrofDoors, NrofSeats, ModelCode, CountryVersion,
            ComfortAndConvenience, EntertainmentAndMedia, Extras, SafetyAndSecurity, Description, DateOfPost
        });
        let CarId = newCar._id;
        await newCar.save();
        res.status(200).json(CarId);
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
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}
// ---------------------Get All New Cars----------------------
exports.getNewCars = async (req, res, next) => { //[]
    adminService.getAllNewCars().then((data) => {
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ msg: 'Data Not Found' });
        }
    }).catch(err => {
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}
// ---------------------Get All Used Cars----------------------
exports.getUsedCars = async (req, res, next) => { //[]
    adminService.getAllUsedCars().then((data) => {
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ msg: 'Data Not Found' });
        }
    }).catch(err => {
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}
// // ---------------------Get All Cars For Admin----------------------
// exports.getCarsForAdmin = async (req, res, next) => { //[]
//     adminService.getAllCarsForAdmin().then((data) => {
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
// ---------------------Delete Car----------------------
exports.deleteCar = async (req, res, next) => { //[]
    let id = req.params.id;
    let usersWhoFavThisCar = await User.find({ 'favourites.carId': { $in: [id] } }, { _id: 1 });
    for (let i = 0; i < usersWhoFavThisCar.length; i++) {
        adminService.deleteFromFavourites(usersWhoFavThisCar[i], id)
    }
    adminService.deleteCar(id).then((car) => {
        if (car) {
            res.status(201).json({ msg: 'Car Deleted Successfuly' });
        }
    }).catch(err => {
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
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}
// ---------most viewed--------------
exports.MostViewsCars = async (req, res, next) => { //[]
    adminService.getMostViewsCars().then((cars) => {
        if (cars) {
            res.json(cars);
        } else {
            res.status(404).json({ msg: 'Data Not Found' });
        }
    }).catch(err => {
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}
// ---------all most viewed--------------

exports.AllMostViewsCars = async (req, res, next) => { //[]
    adminService.getAllMostViewsCars().then((cars) => {
        if (cars) {
            res.json(cars);
        } else {
            res.status(404).json({ msg: 'Data Not Found' });
        }
    }).catch(err => {
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
        res.status(500).json({ msg: 'Internal Server Error' });
    })
}

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
            res.status(500).json({ msg: 'Internal Server Error' });
        })
    }

}
exports.checkFavourties = async (req, res, next) => {
    let id = req.params.id;
    let carId = req.params.carid;
    let checkforFavouriteCar = await User.findOne({
        _id: id,
    }, { favourites: { $elemMatch: { carId } } });
    if (checkforFavouriteCar.favourites.length > 0) {
        return res.status(200).json(true);
    }
    else {
        return res.status(200).json(false);
    }

}
exports.deleteFromFavourites = async (req, res, next) => { //[]
    let id = req.params.id;
    let carId = req.params.carid;
    adminService.deleteFromFavourites(id, carId).then((car) => {
        if (car) {
            res.json({ msg: 'Car Deleted Successfuly From Favourites' });
        } else {
            res.status(404).json({ msg: 'Something Was Wrong' });
        }
    }).catch(err => {
        res.status(500).json({ msg: 'Internal Server Error' });
    })

}
// --------------------------------------------------------------
exports.filterCars = async (req, res, next) => { //[]
    let cardata = await Car.find();
    let response = [];

    const kilo = req.query.Kilometers;
    const year = req.query.FirstRegistration;


    // console.log(req.query)
    if (req.query) {
        cardata = cardata.filter(function (cars) {
            return Number(cars.Kilometers) <= kilo
                && Number(cars.FirstRegistration) >= year
        });
    }
    if (req.query.Brand && req.query.Brand != "undefined") {
        cardata = cardata.filter(function (cars) {
            return cars.Brand.toUpperCase().match(req.query.Brand.toUpperCase());
        });
    }
    if (req.query.Body && req.query.Body != "undefined") {
        cardata = cardata.filter(function (cars) {
            return cars.Body == req.query.Body;
        });
    }
    if (req.query.Condition && req.query.Condition != "undefined") {
        cardata = cardata.filter(function (cars) {
            return cars.Condition == req.query.Condition;
        });
    }
    response = cardata;
    res.json(response);
}



// --------------------------------------------------------------
exports.home = (req, res) => {
    // return res.sendFile(path.join(`${__dirname}/../views/index2.html`));
    // console.log(path.join(__dirname, "/../newimages"))
    // app.use('/image/', express.static(path.join(__dirname, "/../newimages")));
    // return express.static(path.join(__dirname, "/../newimages"));
    // return app.use('/image/', express.static(path.join(__dirname, "/../newimages")));
};
// exports.multipleUpload = async (req, res) => {
//     let DateOfPost = req.params.DateOfPost
//     try {
//         await upload(req, res);
//         if (req.files.length <= 0) {
//             return res.send(`You must select at least 1 file.`);
//         }
//         // console.log(req.files[0])
//         adminService.pushCarPhoto(DateOfPost, req.files[0]).then((carphoto) => {
//             if (carphoto) {
//                 res.send(`Files has been uploaded.`);
//             } else {
//                 res.status(404).json({ msg: 'Data Not Found' });
//             }
//         }).catch(err => {
//             res.status(500).json({ msg: 'Internal Server Error' });
//         });
//     } catch (error) {
//         if (error.code === "LIMIT_UNEXPECTED_FILE") {
//             return res.send("Too many files to upload.");
//         }
//         return res.send(`Error when trying upload many files: ${error}`);
//     }

// };

exports.getMyFavourties = async (req, res, next) => { //[]
    let id = req.params.id;
    let fav = await adminService.getMyFavourties(id)
    let emptyarr = []
    if (fav.favourites) {
        let arr = [];
        let arr2 = [];
        for (let i = 0; i < fav.favourites.length; i++) {
            arr[i] = fav.favourites[i].carId
        }
        for (let y = 0; y < fav.favourites.length; y++) {
            let x = await adminService.getCarData(arr[y]);
            if (x) {
                let data = arr[y];
                let carDate = { data, x }
                arr2[y] = carDate
            }
        }
        res.json(arr2);
    } else if (!fav.favourites) {
        res.json(emptyarr)
    }
}



exports.getAllImagesPath = async (req, res, next) => {
    const dirnameExportImg = path.join(__dirname, "/../newimages")
    fs.readdir(dirnameExportImg, function (err, files) {
        files = files.map(function (fileName) {
            return {
                name: fileName,
                time: fs.statSync(dirnameExportImg + '/' + fileName).mtime.getTime()
            };
        })
            .sort(function (a, b) {
                return b.time - a.time;
            })
            .map(function (v) {
                return v.name;
            });
        res.json(files)
    });
}

