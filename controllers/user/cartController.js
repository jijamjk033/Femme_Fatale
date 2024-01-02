const Cart = require('../../model/cart');
const User = require("../../model/userModel");
const Product = require('../../model/product');
const { calcProductTotal, calcSubtotal } = require('../../config/cartSum');

const loadCartPage = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const userData = await User.findById(userId);
    if (userData) {
      const userCart = await Cart.findOne({ user: userId }).populate("items.product");
      if (userCart) {
        const cart = userCart ? userCart.items : [];
        const subtotal = calcSubtotal(cart);
        const productTotal = calcProductTotal(cart);
        const subtotalWithShipping = subtotal;
        let outOfStockError = false;
        const isCartEmpty = cart.length === 0;
        
        
        if (cart.length > 0) {
          for (const cartItem of cart) {
            const product = cartItem.product;

            if (product.quantity < cartItem.quantity) {
              outOfStockError = true;
              break;
            }
          }
        }
        let maxQuantityErr = false;
        if (cart.length > 0) {
          for (const cartItem of cart) {
            const product = cartItem.product;

            if (cartItem.quantity > 2) {
              maxQuantityErr = true;
              break;
            }
          }
        }
        res.render("cart", {
          userData,
          productTotal,
          subtotalWithShipping,
          outOfStockError,
          maxQuantityErr,
          isCartEmpty,
          cart: cart,
        });

      } else {
        // Handle scenario where user has no cart
        res.render("cart", { userData,
          productTotal: null,
          subtotalWithShipping: null,
          cart: [],
          isCartEmpty: [], });
      }
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error("Error loading cart:", error);
    res.status(500).send("Error loading cart");
  }
};


const addTocart = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const product_Id = req.body.productData_id;
    const { qty } = req.body;
    const existingCart = await Cart.findOne({ user: userId });

    // Find the product and check its stock
    const product = await Product.findById(product_Id);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    if (parseInt(qty) > product.stock) {
      return res.status(400).send('Not enough stock available');
    }

    let newCart = {};
    if (existingCart) {
      const existingCartItem = existingCart.items.find(
        (item) => item.product.toString() === product_Id
      );
      if (existingCartItem) {
        existingCartItem.quantity += parseInt(qty);
      } else {
        existingCart.items.push({
          product: product_Id,
          quantity: parseInt(qty),
        });
      }
      existingCart.total = existingCart.items.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );

      // Update product stock when added to the cart
      product.stock -= parseInt(qty);
      await Promise.all([existingCart.save(), product.save()]);
    } else {
      newCart = new Cart({
        user: userId,
        items: [{ product: product_Id, quantity: parseInt(qty) }],
        total: parseInt(qty, 10),
      });

      // Update product stock when added to an empty cart
      product.stock -= parseInt(qty);
      await Promise.all([newCart.save(), product.save()]);
    }

    res.redirect('/cart');
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).send('Internal Server Error');
  }
};


const updateCartCount = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const userData = await User.findById(userId);
    const productId = req.body.productId;
    const newQuantity = parseInt(req.body.newQuantity);
    const existingCart = await Cart.findOne({ user: userId });

    if (existingCart) {
      const existingCartItem = existingCart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingCartItem) {
        const product = await Product.findById(productId);

        const quantityDifference = newQuantity - existingCartItem.quantity;

        // Check if the new quantity exceeds available stock
        if (product.stock <= newQuantity) {
          return res.status(400).json({ success: false, error: "Insufficient stock" });
        }

        // Check if the updated quantity will cause negative stock
        if (product.stock - quantityDifference < 0) {
          return res.status(400).json({ success: false, error: "Stock cannot go negative" });
        }

        existingCartItem.quantity = newQuantity;
        existingCartItem.subtotal = product.offerPrice * newQuantity;

        // Update the product stock based on the quantity change
        product.stock -= quantityDifference;

        // Recalculate total based on updated subtotals of all items
        const updatedTotal = existingCart.items.reduce(
          (total, item) => total + (item.subtotal || 0),
          0
        );

        // Update the total in the cart
        existingCart.total = updatedTotal;

        // Save changes to the cart and product
        await Promise.all([existingCart.save(), product.save()]);

        // Calculate subtotal and respond with updated values
        const userCart = await Cart.findOne({ user: userId }).populate("items.product");
        const cart = userCart ? userCart.items : [];
        const subtotal = calcSubtotal(cart);
        const subtotalWithShipping = subtotal;

        // Send updated values in the response
        res.json({
          success: true,
          updatedSubtotal: existingCartItem.subtotal,
          updatedTotal: subtotalWithShipping,
        });
      } else {
        res.json({ success: false, error: "Item not found in cart" });
      }
    } else {
      res.json({ success: false, error: "Cart not found" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.json({ success: false, error: "Internal server error" });
  }
};



const removeFromCart = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const productId = req.query.productId;
    const existingCart = await Cart.findOne({ user: userId });
    if (existingCart) {
      const updatedItems = existingCart.items.filter(
        (item) => item.product.toString() !== productId
      );

      existingCart.items = updatedItems;
      existingCart.total = updatedItems.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );

      await existingCart.save();
      res.redirect('/cart');
    } else {
      res.json({ success: false, error: "Cart not found" });
    }
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.json({ success: false, error: "Internal server error" });
  }
};

module.exports = {
  loadCartPage,
  addTocart,
  updateCartCount,
  removeFromCart
}


