const multer = require("multer");
const sharp = require("sharp");
const adminService = require('../service/admin-service');
const multerStorage = multer.memoryStorage();
const Image = require('../models/images')
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const uploadFiles = upload.array("images", 30);

const uploadImages = (req, res, next) => {
  uploadFiles(req, res, err => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send("Too many files to upload.");
      }
    } else if (err) {
      return res.send(err);
    }

    next();
  });
};

const resizeImages = async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async file => {
      const filename = file.originalname.replace(/\..+$/, "");
      const newFilename = `bezkoder-${filename}-${Date.now()}.jpeg`;

      await sharp(file.buffer)
        .resize(640, 320)
        .toFormat("jpeg")
        .jpeg({
          quality: 100,
          chromaSubsampling: '4:4:4'
        })
        .toBuffer()
        // .toFile(`newimages/${newFilename}`)
        .then((data) => {
          // console.log(file.buffer);
          var obj = {
            name: newFilename,
            data: data,
            contentType: file.mimetype
          }
          Image.create(obj, (err, image) => {
            if (err) {
              console.log(err);
            }
            else {
              image.save();
              // res.redirect('/'); 
            }
          });
        });
      req.body.images.push(newFilename);
    })
  );

  next();
};

const getResult = async (req, res) => {
  if (req.body.images.length <= 0) {
    return res.send(`You must select at least 1 image.`);
  }

  const images = req.body.images;
  // .map(image => "" + image + "")
  // .join("");
  // return res.send(`Images were uploaded:${images}`);

  let carId = req.params.carId;
  adminService.pushCarPhoto(carId, images[0]).then((carphoto) => {
    if (carphoto) {
      res.send(`Image has been uploaded.`);
    } else {
      res.status(404).json({ msg: 'Data Not Found' });
    }
  }).catch(err => {
    res.status(500).json({ msg: 'Internal Server Error' });
  });
};

module.exports = {
  uploadImages: uploadImages,
  resizeImages: resizeImages,
  getResult: getResult
};