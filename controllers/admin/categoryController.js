const User=require('../../model/userModel');
const Category=require('../../model/category');

const loadCategory = async (req, res) => {
    try {
      const adminData = await User.findById({ _id: req.session.admin_id });  
      const categoryData= await Category.find();
      res.render('category', { admin: adminData, category: categoryData });
    } catch (error) {
      console.log(error.message);
    }
  };


  const addCategoryform = async(req,res)=>{
    try{
      const adminData = await User.findById({ _id: req.session.admin_id });  
      res.render('addCategory',{ admin: adminData});
    } catch (error) {
      console.log(error.message);
    }
  }
  

  const addCategory = async(req,res)=>{
    try{
      const adminData = await User.findById({ _id: req.session.admin_id });  
      const newCategory = {
        name: req.body.name,
        image: req.file.filename,
        description: req.body.description,
        is_listed: true,
      }
      const existcategory = await Category.findOne({name:newCategory.name})
      if (existcategory) {
        res.render('addCategory', { admin:adminData, errorMessage: 'this category already exists' })
      } else {
          const category = new Category({
            name: newCategory.name,
            image: newCategory.image,
            description: newCategory.description,
            is_listed: true,
          });
          const categoryData = await category.save();
  
          res.redirect('/admin/addCategory');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const editCategoryLoad = async (req, res) => {
    try {
      const id = req.query.id;
      const adminData = await User.findById({ _id: req.session.admin_id });  
      const categoryData = await Category.findById({ _id: id });
      if (categoryData) {
        res.render("edit-category", { admin:adminData ,category: categoryData });
      } else {
        res.redirect("/admin/category");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateCategory = async (req, res) => {
    try {
      const categoryData = await Category.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            name: req.body.name,
            image: req.file.filename,
            description: req.body.description
          },
        }
      );
      res.redirect("/admin/category");
    } catch (error) {
      console.log(error.message);
    }
  };

  
  const unlistCategory = async (req, res) => {
    try {
      const id = req.query.id;
      const categoryData = await Category.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            is_listed: false
          },
        }
      );
      res.redirect("/admin/category");
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const listCategory = async (req, res) => {
    try {
      const id = req.query.id;
      const categoryData = await Category.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            is_listed: true
          },
        }
      );
      res.redirect("/admin/category");
    } catch (error) {
      console.log(error.message);
    }
  };

  module.exports={
    loadCategory,
    addCategoryform,
    addCategory,
    editCategoryLoad,
    updateCategory,
    unlistCategory,
    listCategory

  };