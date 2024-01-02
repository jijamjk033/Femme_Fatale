const express = require('express');
const admin_route = express();
const adminController = require("../controllers/admin/adminController");
const productController = require("../controllers/admin/productController");
const categoryController = require("../controllers/admin/categoryController");
const adminAuth = require("../middlewares/adminAuth");
const multer = require("../middlewares/multer");
const adOrderController = require("../controllers/admin/adOrderController");
const couponController = require("../controllers/admin/couponController")
const offerController=require('../controllers/admin/offerController')

admin_route.set("view engine","ejs");
admin_route.set("views","./views/admin");

//Login
admin_route.get('/', adminAuth.isLogout,adminController.loadLogin);
admin_route.post('/', adminController.verifyLogin);

//Admin Dashboard
admin_route.get('/home',adminAuth.isLogin,adminController.loadDashboard);
admin_route.get('/userData',adminAuth.isLogin,adminController.loadUserpage);
admin_route.get('/userblock',adminAuth.isLogin,adminController.unlistUser);


//Category routes
admin_route.get('/category', adminAuth.isLogin, categoryController.loadCategory);
admin_route.get("/addCategory", adminAuth.isLogin, categoryController.addCategoryform);
admin_route.post("/addCategory", multer.uploadCategory.single("image"),categoryController.addCategory);
admin_route.get("/edit-category", adminAuth.isLogin, categoryController.editCategoryLoad);
admin_route.post("/edit-category",multer.uploadCategory.single("image"), categoryController.updateCategory);
admin_route.get("/unlist-category", categoryController.unlistCategory);
admin_route.get("/list-category", categoryController.listCategory);

//Product
admin_route.get('/product', adminAuth.isLogin, productController.loadProduct);
admin_route.get("/addProduct", adminAuth.isLogin, productController.addProductform);
admin_route.post("/addProduct", multer.uploadCategory.array("image"),productController.addProduct);
admin_route.get("/editProduct", adminAuth.isLogin, productController.loadEditProductForm);
admin_route.post("/editProduct",multer.uploadProduct.array('image'), productController.storeEditedProduct);
admin_route.get("/deleteProduct/:id", productController.deleteProduct);

// Orders
admin_route.get('/adOrders', adminAuth.isLogin, adOrderController.listUserOrders);
admin_route.get('/adOrderDetails', adminAuth.isLogin, adOrderController.listOrderDetails);
admin_route.put('/orderStatusChange', adminAuth.isLogin, adOrderController.orderStatusChange);
admin_route.get('/salesReport', adminAuth.isLogin, adOrderController.loadSalesReport);
admin_route.get('/salesReport/:start/:end', adminAuth.isLogin, adOrderController.dateFilter);

//Coupon
admin_route.get('/addCoupon', adminAuth.isLogin, couponController.loadCouponAdd);
admin_route.post('/addCoupon',adminAuth.isLogin,couponController.addCoupon );
admin_route.get('/couponList', adminAuth.isLogin,couponController.loadCouponList);
admin_route.get('/editCoupon', adminAuth.isLogin, couponController.loadEditCoupon);
admin_route.put('/editCoupon',adminAuth.isLogin,couponController.editCoupon );
admin_route.get('/unlistCoupon', adminAuth.isLogin, couponController.unlistCoupon);

// offer
admin_route.get('/offerProduct', adminAuth.isLogin, offerController.loadProductOffer);
admin_route.post('/updateOffer',adminAuth.isLogin, offerController.updateProductOffer);
admin_route.get('/offerCategory', adminAuth.isLogin, offerController.loadCategoryOffer);
admin_route.post('/updateCategoryOffer',adminAuth.isLogin, offerController.updateCategoryOffer);

//Admin Logout
admin_route.get('/logout', adminAuth.isLogin,adminController.logout);


module.exports = admin_route;