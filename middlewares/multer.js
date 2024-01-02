const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Add the fs module for file system operations

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = './public/assets/images/Products/'; 
    
    // Check if the directory exists, create it if it doesn't
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const storeproductIMG = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = './public/assets/images/Products/'; // Update the path
    // Check if the directory exists, create it if it doesn't
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const storeUser = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, './public/assets/images/users/');
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});


module.exports = {
  uploadCategory: multer({ storage: storage }),
  uploadProduct: multer({ storage: storeproductIMG }),
  uploadUser: multer({ storage: storeUser })
};
