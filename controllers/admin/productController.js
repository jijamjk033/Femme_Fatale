const User=require('../../model/userModel');
const Product=require('../../model/product');
const Category=require('../../model/category');

// Load product page after login
const loadProduct = async (req, res) => {
    try {
      const adminData = await User.findById({ _id: req.session.admin_id }); 
      const categoryData = await Category.find(); 
      const productData= await Product.find();
      res.render('product',{admin: adminData,products:productData,category:categoryData});
    } catch (error) {
      console.log(error.message);
    }
  };

// Load add-product page
  const addProductform = async(req,res)=>{
    try{
      const adminData = await User.findById({ _id: req.session.admin_id });  
      const categoryData = await Category.find(); 
      res.render('addProduct',{ admin: adminData, category: categoryData } );
    } catch (error) {
      console.log(error.message);
    }
  }

// Add new product to database
  const addProduct = async(req,res)=>{
    try{
      const adminData = await User.findById({ _id: req.session.admin_id });  
      const categoryData = await Category.find(); 
      const images = req.files.map((x) => x.filename)
      const newProduct = {
        name: req.body.name,
        image: images,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock
      }
      const existproduct = await Product.findOne({name:newProduct.name})
      if (existproduct) {
        res.render('addProduct', { admin:adminData, errorMessage: 'this product already exists', category: categoryData  })
      } else {
          const product = new Product({
            name: newProduct.name,
            image: newProduct.image,
            description: newProduct.description,
            category: newProduct.category,
            price: newProduct.price,
            stock: newProduct.stock
          });
          const productData = await product.save();
  
          res.redirect('/admin/addProduct');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Load editProduct page
  const loadEditProductForm = async (req, res) => {
    try {
      const id = req.query.id;
      const adminData = await User.findById({ _id: req.session.admin_id }); 
      const product = await Product.findOne({ _id: id });
      let categories = await Category.find({});
      res.render("edit-product", { category:categories, product:product,admin:adminData });
    } catch (error) {
      console.log(error.message);
    }
  };

  
  //Stores edited products
  const storeEditedProduct = async (req, res) => {
    try {
      const existingProduct = await Product.findById(req.body.product_id);
      
      const {
        name,
        category,
        price,
        stock,
        description,
      } = req.body;
  
      let image = existingProduct.image; 
  
      // Check if new files are uploaded
      if (req.files && req.files.length > 0) {
        image = req.files.map((x) => x.filename); // Update images if new files are uploaded
      }
  
      await Product.findByIdAndUpdate(
        { _id: req.body.product_id },
        {
          $set: {
            name,
            category,
            price,
            description,
            stock,
            image,
          },
        }
      );
      res.redirect("/admin/product");
    } catch (error) {
      console.log(error.message);
    }
  };
  

  //Delete products
  const deleteProduct = async (req, res) => {
    try {
      const id = req.params.id;
      const productData = await Product.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            is_listed: false,
          },
        }
      );
      res.redirect("/admin/product");
    } catch (error) {
      console.log(error.message);
    }
  };
  

  module.exports = {
    loadProduct,
    addProductform,
    addProduct,
    loadEditProductForm,
    storeEditedProduct,
    deleteProduct
  };