const mongoose = require('mongoose');

const Product = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  image:[{
    type:String,
    required:true
  }],

  description: {
    type: String,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },

  price:{
    type:Number,
    required:true
  },

  
  offerPrice: {
    type: Number,
  },

  stock: {
    type:Number,
    required:true
  },
  
  is_listed:{
    type:Boolean,
    default:true
  },

  productAddDate: {
    type: Date,
    default: Date.now, // Store the current date and time when the product is created
  },
});


module.exports = mongoose.model('Product', Product);