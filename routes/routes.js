const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin-controller');
const userController = require('../controllers/user-controller');
const uploadController = require('../middleware/uploadwithresize')
//------------------------User-------------------
router.post('/register', adminController.Register);

router.post('/login', adminController.login);

router.post('/addnewcar', adminController.addNewCar);

router.get('/profile/:id', adminController.profile);

router.get('/mypassword/:id', adminController.Password);

router.get('/comparepassword/:id/:password', adminController.ComparePassword);



router.put('/updateuser/:id', adminController.updateEmail);

router.put('/updatepassword/:id', adminController.updatePassword);


//------------------------Car-------------------


router.get('/car/:id', adminController.getCar);

router.get('/cars', adminController.getCars);

router.get('/new/cars', adminController.getNewCars);

router.get('/used/cars', adminController.getUsedCars);


// router.get('/carsforadmin', adminController.getCarsForAdmin);


router.delete('/deletecar/:id', adminController.deleteCar);

router.put('/updatecar/:id', adminController.updateCar);
router.put('/incrementviews/:id', adminController.increamentViews);


// router.get('/carssearch', adminController.searchForCars);

router.post('/addtofavourites/:id/:carid', adminController.addToFavourites);

router.delete('/deletefromfavourites/:id/:carid', adminController.deleteFromFavourites);



router.get('/filter/cars', adminController.filterCars);
router.get('/mostviewscars', adminController.MostViewsCars);

router.get('/allmostviewscars', adminController.AllMostViewsCars);

router.get('/latestcars', adminController.RecentCars);

router.get('/myfavourties/:id', adminController.getMyFavourties);

router.get('/checkinfavourties/:id/:carid', adminController.checkFavourties);



router.post("/multiple-upload/:DateOfPost", adminController.multipleUpload);

router.get('/allimages', adminController.getAllImagesPath);

// router.get('/image/:image', adminController.home);
// router.post("/multiple-upload", adminController.multipleUpload);
// router.use('/image/', express.static(__dirname+'/public/assets/category_pic/'));

module.exports = router;