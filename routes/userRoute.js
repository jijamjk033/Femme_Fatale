const express = require("express");
const user_route = express();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer");
const userController = require("../controllers/user/userController");
const addressController= require("../controllers/user/addressController");
const cartController = require("../controllers/user/cartController");
const orderController = require("../controllers/user/orderController");
const couponController = require("../controllers/admin/couponController")


user_route.use(express.static("public"));

user_route.set('view engine','ejs');
user_route.set('views','./views/user');

// User registration
user_route.get('/register',auth.isLogout,userController.loadRegister);
user_route.post('/register',userController.insertUser);

// OTP
user_route.get('/otp',userController.loadOtp);
user_route.post('/otp',userController.verifyOtp);
user_route.get('/resendotp',userController.resendOTP);

// Home page
user_route.get('/',userController.loadHome);

// User Login
user_route.get('/login',auth.isLogout,userController.loginLoad);
user_route.post('/login',userController.verifyLogin);
user_route.get('/profile',auth.isLogin,userController.loadprofile);
user_route.post('/profile', multer.uploadUser.single("image"),userController.userEdit);
user_route.post('/updateProfilePic',multer.uploadUser.single('croppedImage'),userController.updateUserProfilepic);

// Address
user_route.get('/address',auth.isLogin,addressController.loadAddress);
user_route.get('/addAddress',auth.isLogin,addressController.addAddressPage);
user_route.post('/addAddress',auth.isLogin,addressController.addNewAddress);
user_route.get('/editAddress',auth.isLogin,addressController.editAddressPage);
user_route.post('/editAddress',auth.isLogin,addressController.updateAddress);
user_route.get('/deleteAddress',auth.isLogin,addressController.deleteAddress);

// Forgot Password
user_route.get('/forgotPassword',auth.isLogout,userController.loadForgotPassword);
user_route.post('/forgotPassword',auth.isLogout,userController.forgetPassword);
user_route.post('/confirmPassword',auth.isLogout,userController.confirmPassword);
user_route.get('/resetPassword',auth.isLogin,userController.loadResetPassword);
user_route.post('/resetPassword',auth.isLogin,userController.resetPassword);

// cart controller
user_route.get('/cart',auth.isLogin,cartController.loadCartPage );
user_route.post('/cart',auth.isLogin,cartController.addTocart );
user_route.post("/editCart",auth.isLogin,cartController.updateCartCount);
user_route.get("/remove",auth.isLogin,cartController.removeFromCart);

// Order controller
user_route.get('/checkout',auth.isLogin,orderController.loadCheckout);
user_route.post('/checkout',auth.isLogin,orderController.checkOutPost);
user_route.post('/razorPay',auth.isLogin,orderController.razorPayOrder);
user_route.get('/orderList',auth.isLogin,orderController.loadOrderDetails);
user_route.get('/orderDetails/:id',auth.isLogin,orderController.loadOrderHistory );
user_route.post('/orderCancel',auth.isLogin,orderController.orderCancel );
user_route.post('/return',auth.isLogin,orderController.returnData );

// Home and Shop 
user_route.get('/home',auth.isLogin,userController.loadHome);
user_route.get('/shop',userController.loadShop );
user_route.get('/singleProduct/:id',auth.isLogin,userController.loadSingleShop );

// coupon
user_route.get('/coupons',auth.isLogin,couponController.userCouponList);
user_route.post('/applyCoupon',auth.isLogin,orderController.applyCoupon );

//Wallet
user_route.get('/wallet',auth.isLogin,userController.loadWallets);
user_route
//Logout
user_route.get('/logout',auth.isLogin,userController.userLogout);

module.exports = user_route;