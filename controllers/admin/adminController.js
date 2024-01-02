const User=require('../../model/userModel');
const bcrypt=require('bcrypt');
const Order = require("../../model/order");
const Product = require('../../model/product');
const Category = require('../../model/category');
const { getMonthlyDataArray, getDailyDataArray, getYearlyDataArray,} = require("../../config/chartData");

// render login page
const loadLogin = async (req, res) => {
    try {
      res.render("adminLogin");
    } catch (error) {
      console.log(error.message)
    }
  };

// admin verification
const verifyLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const adminData = await User.findOne({ email: email });
  
      if (adminData) {
        const passwordMatch = await bcrypt.compare(password, adminData.password);
        console.log(passwordMatch)
        console.log(adminData);

        if (passwordMatch && adminData.is_admin == 1) {
          req.session.admin_id = adminData._id;
          res.redirect("/admin/home");
        } else {
          res.render("adminLogin", {
            message: "Email and password are incorrect",
          });
        }
      } else {
        res.render("adminLogin");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const loadUserpage= async(req, res)=>{
    try {
      const adminData = await User.findById(req.session.admin_id);
  
      const usersData = await User.find({
        is_admin : 0
      });
  
      res.render('userList', { users: usersData, admin: adminData });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error: " + error.message);
    }
  };
  

  const  unlistUser = async (req, res) => {
    try {
      const id = req.query.id;
      const userData = await User.findById(id);
  
      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Toggle the 'is_blocked' status
      userData.is_blocked = userData.is_blocked === 1 ? 0 : 1;
  
      await userData.save();
  
      res.redirect("/admin/userData");
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  



  const loadDashboard = async (req, res) => {
    try {
      const adminData = await User.findById(req.session.admin_id);
  
      const totalRevenue = await Order.aggregate([
        { $match: { paymentStatus: "success" } },
        { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
      ]);
  
      const totalUsers = await User.countDocuments({ is_blocked: 1});
      const totalOrders = await Order.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalCategories = await Category.countDocuments();
      const order = await Order.find().populate("user").limit(10).sort({ orderDate: -1 });
  
      const monthlyEarnings = await Order.aggregate([
        {
          $match: {
            paymentStatus: "success",
            orderDate: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        },
        { $group: { _id: null, monthlyAmount: { $sum: "$totalAmount" } } },
      ]);
      const totalRevenueValue =
      totalRevenue.length > 0 ? totalRevenue[0].totalAmount : 0;
    const monthlyEarningsValue =
      monthlyEarnings.length > 0 ? monthlyEarnings[0].monthlyAmount : 0;
  
      const newUsers = await User.find({ is_blocked: 1,isAdmin:0  })
        .sort({ date: -1 })
        .limit(5);
  
        // Get monthly data
        const monthlyDataArray = await getMonthlyDataArray();
  
        // Get daily data
        const dailyDataArray = await getDailyDataArray();
      
        // Get yearly data
        const yearlyDataArray = await getYearlyDataArray();
  
      const monthlyOrderCounts= monthlyDataArray.map((item) => item.count)
    
      const dailyOrderCounts= dailyDataArray.map((item) => item.count)
  
      const yearlyOrderCounts= yearlyDataArray.map((item) => item.count)
  
      res.render("adminHome", {
        admin: adminData,
        totalRevenue:totalRevenueValue,
        totalOrders,
        totalCategories,
        totalProducts,
        totalUsers,
        newUsers,
        order,
        monthlyEarningsValue,
        monthlyOrderCounts,
        dailyOrderCounts,
        yearlyOrderCounts,
      });
    } catch (error) {
      console.log(error.message);
      // Handle errors appropriately
    }
  };

  // Logout
  const logout = async (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/admin");
    } catch (error) {
      console.log(error.message);
    }
  };

  module.exports = {
    loadLogin,
    verifyLogin,
    loadUserpage,
    unlistUser,
    loadDashboard,
    logout
  };