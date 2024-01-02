const User=require('../../model/userModel');
const Coupon=require('../../model/coupons');


const loadCouponAdd = async (req, res) => {
    try {
        const admin = req.session.admin_id
        res.render("addCoupon", { admin });
      
     
    } catch (error) {
      console.log(error.message);
    }
  };


  const addCoupon = async (req, res) => {
    try {
      const admin = req.session.admin_id;
      let {
        coupon_code,
        discount,
        limit,
        minAmt,
        maxAmt,
        expiryDate } = req.body;
  
      coupon_code = coupon_code.replace(/\s/g, "");
  
      console.log(req.body, "req.body");
  
      const existingCoupon = await Coupon.findOne({
        code: { $regex: new RegExp("^" + coupon_code, "i") },
      });
  
      if (existingCoupon) {
        return res.status(500).json({ success: false, error: "Coupon code already exists" });
      }
  
      const newCoupon = new Coupon({
        code: coupon_code,
        discount: discount,
        limit: limit,
   
        expiry: expiryDate,
        maxAmt: maxAmt,
        minAmt: minAmt,
      });
  
      await newCoupon.save();
      res.status(200).json({ success: true, message: "Coupon added successfully" });
    } catch (error) {
      console.error(error); // Log the complete error object for detailed information
      res.status(500).json({ success: false, error: "Failed to add coupon" });
    }
  };

  const loadCouponList = async (req, res) => {
    try {
        const admin = req.session.admin_id;
        const page = parseInt(req.query.page) || 1;
      let query = {};
      const limit =7;
      const totalCount = await Coupon.countDocuments(query);
  
      const totalPages = Math.ceil(totalCount / limit);
      const coupon = await Coupon.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdDate: -1 });
        console.log(coupon);
      res.render("couponList", { coupon, admin, totalPages, currentPage: page });
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadEditCoupon = async (req, res) => {
    try {
      const admin = req.session.admin_id;
      const couponId = req.query.couponId;
      const coupon = await Coupon.findById(couponId);
      const expiry = new Date(coupon.expiry).toISOString().split("T")[0];

      res.render("editCoupon", { admin, coupon,expiry });
    } catch (error) {
      console.log(error.message);
    }
  };

  const editCoupon = async (req, res) => {
    try {
        const couponId = req.query.couponId;

        let {
            coupon_code,
            discount,
            limit,
            minAmt,
            maxAmt,
        
            expiryDate
        } = req.body;


        if (!coupon_code || !discount || !expiryDate ) {
            return res.status(400).json({ success: false, error: "Required fields missing" });
        }

        const existingCoupon = await Coupon.findOne({
            code: { $regex: new RegExp("^" + coupon_code, "i") },
            _id: { $ne: couponId }
        });

        if (existingCoupon) {
            return res.status(400).json({ success: false, error: "Coupon code already exists" });
        }

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            { _id: couponId },
            {
                $set: {
                    code: coupon_code,
                    discount: discount,
                    limit: limit,
              
                    expiry: expiryDate,
                    maxAmt: maxAmt,
                    minAmt: minAmt,
                },
            },
            { new: true } // To get the updated document
        );

        if (!updatedCoupon) {
            return res.status(404).json({ success: false, error: "Coupon not found" });
        }

        res.status(200).json({ success: true, message: "Coupon updated successfully", data: updatedCoupon });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, error: "Failed to update coupon" });
    }
};

const unlistCoupon = async (req, res) => {
  try {
    const id = req.query.couponId;
    const couponData = await Coupon.findById({ _id: id });

    if (couponData.is_listed == false) {
      couponData.is_listed = true;
    } else {
      couponData.is_listed = false;
    }

    await couponData.save();
    res.redirect("/admin/couponList");
  } catch (error) {
    console.log(error.message);
  }
};

const userCouponList = async (req, res) => {
  try {
    const currentDate = new Date();
    const userId = req.session.user_id;
    
    const userData = await User.findById(userId);
    if (userData) {
      const coupon = await Coupon.find({
        expiry: { $gt: currentDate },
        is_listed: true,
      }).sort({ createdDate: -1 });
      res.render("coupons", { coupon, userData });
    }
  
  } catch (error) {
    console.log(error.message);
  }
};

module.exports={
    loadCouponAdd,
    addCoupon,
    loadCouponList,
    loadEditCoupon,
    editCoupon,
    unlistCoupon,
    userCouponList

}