const User = require("../../model/userModel");
const bcrypt = require('bcrypt');
const message = require('../../config/email');
const Product = require('../../model/product');
const Category = require('../../model/category');
const Wallet = require('../../model/wallet');


//Encrypts the password recieved as parameter
const securePassword = async (password) => {

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
}

//Display Home page
const loadHome = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    if (!req.session.user_id) {
      res.render("home", { products });
    } else {
      const userData = await User.findById({ _id: req.session.user_id });
      console.log(userData);
      // Assuming 'productsData' is an array of products fetched from somewhere
      res.render("home", { userData: userData, products });
    }
  } catch (error) {
    console.log(error.message);
  }
};



//Display registration page
const loadRegister = async (req, res) => {
  referral = req.query.referralCode;
  try {
    res.render('registration', referral);

  } catch (error) {
    console.log(error.message);
  }
}


//Adds a new user in Register

const insertUser = async (req, res) => {
  try {

    const email = req.body.email;
    const mobile = req.body.mobile;
    const name = req.body.name;
    const password = req.body.password;
    req.session.referralCode = req.body.referralCode || null;

    if (!email || !mobile || !name || !password) {
      return res.render('registration', {
        message: "Please check the details entered"
      });
    }

    const existMail = await User.findOne({ email: email });

    if (req.session.referralCode) {
      referrer = await User.findOne({ referralCode: req.session.referralCode });

      if (!referrer) {
        res.render('registration', { message: "Invalid referral code." });
      }

      if (referrer.userReferred.includes(req.body.email)) {
        res.render('registration', {
          message: "Referral code has already been used by this email.",
        });
      }
    }

    if (existMail) {
      res.render('registration', { message: "This user already exists" });
    } else {
      req.session.userData = req.body;
      req.session.userRegistration = true;
      res.redirect("/otp");
    }
  } catch (error) {
    console.log(error);
  }
};

// Get OTP Page
const loadOtp = async (req, res) => {
  const userData = req.session.userData;
  const email = userData.email;

  await message.sendVarifyMail(email, req);

  try {
    res.render("otp");
  } catch (error) {
    console.log(error.message);
  }
};

async function generateReferralCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const codeLength = 8;
  let referralCode = '';

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters.charAt(randomIndex);
  }

  return referralCode;
}

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const userData = req.session.userData;
    const enteredOtp = req.body.otp;
    const storedOtp = req.session.otp;
    const referral = await generateReferralCode();

    if (enteredOtp === storedOtp) {

      if (req.session.userRegistration) {
        
        const securedPassword = await securePassword(userData.password);
        const user = new User({
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
          password: securedPassword,
          referralCode: referral,
          is_admin: 0,
          is_blocked: 1,
        });
        const userDataSave = await user.save();

        if (userDataSave) {

          if (req.session.referralCode) {
            req.session.user_id = userDataSave._id;

            const walletData = await Wallet.findOne({ user: req.session.user_id });
            if (walletData) {
              walletData.walletBalance += 50;
              walletData.transaction.push({
                type: "credit",
                amount: 50,
              });

              await walletData.save();
            } else {
              const wallet = new Wallet({
                user: req.session.user_id,
                transaction: [{ type: "credit", amount: 50 }],
                walletBalance: 50,
              });
              await wallet.save();
            }

            const referrer = await User.findOne({ referralCode: req.session.referralCode });
            const user = await User.findOne({ _id: req.session.user_id });
            if (!referrer.userReferred.includes(user.email))
              referrer.userReferred.push(user.email);

            await referrer.save();
            const walletrefer = await Wallet.findOne({ user: referrer._id });

            if (walletrefer) {
              walletrefer.walletBalance += 100;
              walletrefer.transaction.push({
                type: "credit",
                amount: 100,
              });

              await walletrefer.save();
            } else {
              const wallet = new Wallet({
                user: referrer._id,
                transaction: [{ type: "credit", amount: 100 }],
                walletBalance: 100,
              });
              await wallet.save();
            }

          }
          
          return res.redirect("/login");

        } else {
          return res.render("./otp", { message: "Registration Failed" });
        }
      } else if (req.session.forgetPassword) {
        return res.render('confirmPassword');
      }
    } else {
      return res.render("./otp", { message: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("An error occurred. Please try again later.");
  }
};  



// resend otp
const resendOTP = async (req, res) => {
  try {

    const userData = req.session.userData;
    if (!userData) {
      res.status(400).json({ message: "Invalid or expired session" });
    }

    await message.sendVarifyMail(userData.email, req);

    res.render("otp", { message: "OTP resend successfully" });
  } catch (error) {
    console.error("Error: ", error);
    res.render("otp", { message: "Failed to send otp" });
  }
};

//Display Login page
const loginLoad = async (req, res) => {

  try {
    res.render('login');
  } catch (error) {
    console.log(error.message);
  }
}

//Verifies User Login
const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch && userData.is_admin == 0) {
        if ((req.session.user_id = userData._id)) {
          res.redirect("/home");
        }
      } else {
        res.render("login", { message: "Email and password is incorrect" });
      }
    } else {
      res.render("login", { message: "Email and password is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Load user profile page
const loadprofile = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const userData = await User.findById(userId);
    if (userData) {
      res.render("userProfile", { userData });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};


// Edit user details
const userEdit = async (req, res) => {
  try {
    let id = req.body.user_id;

    const userData = await User.findById(id);

    const { name, mobile } = req.body;

    if (!req.file) {
      const updateData = await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name,
            mobile,

          },
        }
      );
    }
    else {
      const updateData = await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name,
            mobile,
            image: req.file.filename,
          },
        }
      );
    }
    res.redirect("/profile");
  } catch (error) {
    console.log(error.message);
  }
};


const updateUserProfilepic = async (req, res) => {
  try {
    const userData = await User.findById(req.session.user_id);

    if (!req.file) {
      // Handle error if no file is received
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const croppedImage = req.file.filename;

    await User.findByIdAndUpdate(userData._id, {
      $set: {
        image: croppedImage,
      },
    });

    res.status(200).json({ success: true, message: 'Profile Picture changed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


//Load Forgot password page
const loadForgotPassword = async (req, res) => {
  try {
    res.render('forgotPassword');
  } catch (error) {
    console.log(error.message);
  }
};

//Forget Password
const forgetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });

    if (!userData) {
      return res.render('forgotPassword', { message: "Invalid email or user not found." });
    } else {
      req.session.userData = userData; // Store user data in session
      req.session.forgetPassword = true;
      console.log(req.session.userData);
      return res.redirect("./otp"); // Redirect to OTP verification
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("An error occurred. Please try again later.");
  }
};


// Confirm Password
const confirmPassword = async (req, res) => {
  try {
    const newPassword = req.body.password;
    const email = req.session.userData.email;

    if (!newPassword) {
      return res.render('confirmPassword', { message: "Please enter a valid Password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.render('confirmPassword', { message: "User not found" });
    }

    const hashedPassword = await securePassword(newPassword);

    user.password = hashedPassword;
    await user.save();

    delete req.session.userData;
    delete req.session.forgetPassword;

    return res.redirect("/login");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("An error occurred. Please try again later.");
  }
};

//Load Forgot password page
const loadResetPassword = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const userData = await User.findById(userId);
    if (userData) {
      res.render("resetPassword", { userData });
    } else {
      res.redirect("/profile");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// reset existing Password
const resetPassword = async (req, res) => {
  try {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const userId = req.session.user_id;
    const userData = await User.findById(userId);

    if (!newPassword || !confirmPassword) {
      return res.render('resetPassword', { message: "Fields should not be empty" });
    }

    if (!userData) {
      return res.render('resetPassword', { message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, userData.password);

    if (!isPasswordValid) {
      return res.render('resetPassword', { message: "Check your current password" });
    }
    const hashedPassword = await securePassword(newPassword);

    userData.password = hashedPassword;
    await userData.save();
    return res.redirect("/profile");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("An error occurred. Please try again later.");
  }
};


//Load the product list at userside
const loadShop = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const userData = await User.findById(userId);
    const page = parseInt(req.query.page) || 1; // Get page parameter or default to 1
    const perPage = 12; // Number of products per page
    const offset = (page - 1) * perPage;

    const productData = await Product.find()
      .skip(offset)
      .limit(perPage);

    const categories = await Category.find();

    res.render("shop", { products: productData, userData, category: categories, currentPage: page });

  } catch (error) {
    console.log(error.message);
  }
};



//Load a single product at userside
const loadSingleShop = async (req, res) => {
  try {

    const userId = req.session.user_id;
    const userData = await User.findById(userId);
    const productId = req.params.id;
    const products = await Product.findById(productId);
    const category = await Category.find();

    res.render("singleProduct", { userData, products, category });
  } catch (error) {
    console.log(error.message);
  }
};

const loadWallets = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const userData = await User.findById(userId);

    if (!userData) {
      return res.render("login", { userData: null });
    }

    const page = parseInt(req.query.page) || 1; // Get page parameter or default to 1
    const perPage = 7; // Number of transactions per page
    const offset = (page - 1) * perPage;

    const walletData = await Wallet.findOne({ user: userId }).sort({ 'transaction.date': -1 })
      .populate({
        path: 'transaction',
        options: { skip: offset, limit: perPage },
      });

    if (!walletData) {
      return res.render("wallet", { userData, wallet: null });
    }

    res.render("wallet", { userData, wallet: walletData, currentPage: page });

  } catch (err) {
    console.error("Error in loadWallets route:", err);
    res.status(500).send("Internal Server Error");
  }
};



//User Logout
const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};



module.exports = {
  loadRegister,
  insertUser,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
  loadOtp,
  verifyOtp,
  resendOTP,
  loadShop,
  loadSingleShop,
  loadForgotPassword,
  forgetPassword,
  confirmPassword,
  securePassword,
  loadResetPassword,
  loadprofile,
  userEdit,
  resetPassword,
  loadWallets,
  updateUserProfilepic
};
