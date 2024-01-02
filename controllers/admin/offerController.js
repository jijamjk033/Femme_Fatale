const Product = require('../../model/product');
const Category = require('../../model/category');
const User=require('../../model/userModel');

const loadProductOffer = async (req, res) => {
  try {
    const product = await Product.find();
    const adminData = await User.findById({ _id: req.session.admin_id });
    res.render("productOffer", { product, admin: adminData });
  } catch (error) {
    console.log(
      "Error loading Product Offer page "
    );
  }
};

const updateProductOffer = async (req, res) => {
  try {
    let { id, offerPrice } = req.body;
    const userId = req.session.userId;
     offerPrice = parseInt(offerPrice, 10);

    const product = await Product.findById(id);
    let productData = product._id;
    let users = await User.find({});
    const cappedPercentage = Math.min(offerPrice, 100);
    const percentage = (product.price * cappedPercentage) / 100;
    product.offerPrice = Math.round(product.price - percentage);
    product.offerPercentage = cappedPercentage;

    users.forEach(async (user) => {
      user.cart?.forEach((cart) => {
        if (cart.productId == product._id + "") {
          cart.product.offerPrice = product.offerPrice;
        }
      });
      await User.findByIdAndUpdate(user._id, { $set: { cart: user.cart } });
    });

    console.log(product.offerPrice, "updated product price");

    await product.save();
    
    res.redirect("/admin/offerProduct");
  } catch (error) {
    console.log(error, "error");
  }
};


const loadCategoryOffer = async (req, res) => {
  try {
    const categories = await Category.find();
    const adminData = await User.findById({ _id: req.session.admin_id });
    const itemsperpage = 8;
    const currentpage = parseInt(req.query.page) || 1;
    const startindex = (currentpage - 1) * itemsperpage;
    const endindex = startindex + itemsperpage;
    const totalpages = Math.ceil(categories.length / 8);
    const currentproduct = categories.slice(startindex, endindex);

    res.render("categoryOffer", {
      categories: currentproduct,
      totalpages,
      currentpage,
      admin: adminData
    });
  } catch (error) {
    console.log(
      "Error happened in the offerctrl in the function catogaryOffer:",
      error
    );
  }
};

const updateCategoryOffer = async (req, res) => {
  try {
    let { id, offerPercentage } = req.body;
    const category = await Category.findById(id);
    offerPercentage = parseInt(offerPercentage, 10);
    const products = await Product.find({ category: category._id });

    products.forEach(async (product) => {
      const discountAmount = (offerPercentage / 100) * product.price;
      const newOfferPrice = Math.round(product.price - discountAmount);

      await Product.findByIdAndUpdate(product._id, {
        offerPrice: newOfferPrice,
      });
    });
    res.redirect("/admin/offerProduct");
  } catch (error) {
    console.log(
      "Error happened in the offerctrl in the function catogaryOffer:",
      error
    );
  }
};

module.exports={
  loadProductOffer,
  updateProductOffer,
  loadCategoryOffer,
  updateCategoryOffer

}