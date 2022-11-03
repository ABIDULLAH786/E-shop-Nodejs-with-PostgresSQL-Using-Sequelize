const multer = require('multer');

exports.uploadUserImage = multer({
    storage: multer.diskStorage({
        destination: 'assets/user-images/',
        filename: function (req, file, callback) {
            callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        }
    })
}).single('photo'); 

exports.uploadProductImage = multer({
    storage: multer.diskStorage({
        destination: 'assets/product-images/',
        filename: function (req, file, callback) {
            callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        }
    })
}).single('product_image'); 