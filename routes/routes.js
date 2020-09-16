const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin-controller');
const userController = require('../controllers/user-controller');
//------------------------User-------------------
router.post('/register', adminController.Register);

router.post('/login', adminController.login);

router.get('/profile/:id', adminController.profile);

router.put('/updateuser/:id', adminController.updateUser);

//------------------------Car-------------------
router.post('/addcar', adminController.addCar);

router.get('/car/:id', adminController.getCar);

router.get('/cars', adminController.getCars);

router.get('/carsforadmin', adminController.getCarsForAdmin);


router.delete('/deletecar/:id', adminController.deleteCar);

router.put('/updatecar/:id', adminController.updateCar);
router.put('/incrementviews/:id', adminController.increamentViews);


// router.get('/carssearch', adminController.searchForCars);

router.post('/addtofavourites/:id/:carid', adminController.addToFavourites);


router.get('/filter/cars', adminController.filterCars);
router.get('/mostviewscars', adminController.MostViewsCars);
router.get('/latestcars', adminController.RecentCars);



router.get("/", adminController.home);
router.post("/multiple-upload", adminController.multipleUpload);






module.exports = router;