const Cart = require('../../model/cart');
const User = require("../../model/userModel");
const Order = require("../../model/order");
const Product = require('../../model/product');
const Address = require('../../model/address');
const Wallet = require('../../model/wallet');
const Coupon = require('../../model/coupons');
const { calcProductTotal, calculateDiscountedTotal, calcSubtotal } = require('../../config/cartSum');
const Razorpay = require('razorpay');
require("dotenv").config();


var instance = new Razorpay({
  key_id: `${process.env.key_id}`,
  key_secret: `${process.env.key_secret}`,
});

// Load checkout page
const loadCheckout = async (req, res) => {
  try {
    const userId = req.session.user_id;

    const userData = await User.findById(userId);

    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.product",
        model: "Product",
      })
      .exec();

    if (!cart) {
      console.log("Cart not found.");
    }

    const cartItems = cart.items || [];
    const subtotal = calcSubtotal(cartItems);
    const productTotal = calcProductTotal(cartItems);
    const subtotalWithShipping = subtotal;
    const addressData = await Address.find({ user: userId });

    res.render("checkout", { userData, addressData, cart: cartItems, productTotal, subtotalWithShipping });
  } catch (err) {
    console.error("Error fetching user data and addresses:", err);
  }
};

// Razor pay
const razorPayOrder = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const { address, paymentMethod, couponCode } = req.body;

    const user = await User.findById(userId);

    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.product",
        model: "Product",
      })
      .populate("user");

    if (!user || !cart) {
      return res.status(500).json({ success: false, error: "User or cart not found." });
    }

    if (!address) {
      return res.status(400).json({ error: "Billing address not selected" });
    }

    const cartItems = cart.items || [];
    let totalAmount = 0;
    totalAmount = cartItems.reduce(
      (acc, item) => acc + (item.product.offerPrice * item.quantity || 0),
      0
    );

    if (couponCode) {
      totalAmount = await applyCoup(couponCode, totalAmount, userId);

    }

    const options = {
      amount: Math.round(totalAmount * 100), // Razorpay accepts amount in paisa
      currency: 'INR',
      receipt: `order_${Date.now()}`, // Use a timestamp as a receipt
      payment_capture: 1,
    };

    instance.orders.create(options, async (err, razorpayOrder) => {
      if (err) {
        console.error("Error creating Razorpay order:", err);
        return res
          .status(400)
          .json({ success: false, error: "Payment Failed", user });
      } else {

        res.status(201).json({
          success: true,
          message: "Order placed successfully.",
          order: razorpayOrder,
        });
      }
    });
  } catch (error) {
    console.error("An error occurred while placing the order: ", error);
    return res.status(400).json({ success: false, error: "Payment Failed" });
  }
};

async function generateRandomId(length) {
  const characters = '0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

// Checkout post

const checkOutPost = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const randomId = await generateRandomId(6);

    const { address, paymentMethod, couponCode } = req.body;

    const user = await User.findById(userId);

    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.product",
        model: "Product",
      })
      .populate("user");

    if (!user || !cart) {
      return res
        .status(500)
        .json({ success: false, error: "User or cart not found." });
    }

    if (!address) {
      return res.status(400).json({ error: 'Billing address not selected' });
    }

    const cartItems = cart.items || [];

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'No products added to the cart' });
    }

    let totalAmount = cartItems.reduce(
      (acc, item) => acc + (item.product.offerPrice * item.quantity || 0),
      0
    );

    if (couponCode) {
      totalAmount = await applyCoup(couponCode, totalAmount, userId);
    }


    if (paymentMethod == "Wallet") {
      const walletData = await Wallet.findOne({ user: userId });
      if (walletData != null) {

        if (totalAmount <= walletData.walletBalance) {

          walletData.walletBalance -= totalAmount;
          walletData.transaction.push({
            type: "debit",
            amount: totalAmount,
          });

          await walletData.save();


          const order = new Order({
            user: userId,
            address: address,
            orderDate: new Date(),
            randomId: randomId,
            deliveryDate: new Date(
              new Date().getTime() + 5 * 24 * 60 * 60 * 1000
            ),
            totalAmount: totalAmount,
            coupon: couponCode,
            items: cartItems.map((cartItem) => ({
              product: cartItem.product._id,
              quantity: cartItem.quantity,
              price: cartItem.product.discountPrice ? cartItem.product.discountPrice : cartItem.product.price,
              status: "Confirmed",
              paymentMethod: paymentMethod,
              paymentStatus: "success",
            })),
          });

          await order.save();
        } else {
          return res
            .status(500)
            .json({ success: false, error: "insuficient balance." });
        }
      } else {

        return res
          .status(500)
          .json({ success: false, error: " no wallet." });
      }

    }

    else if (paymentMethod == "onlinePayment") {
      const order = new Order({
        user: userId,
        address: address,
        coupon: couponCode,
        randomId: randomId,
        orderDate: new Date(),
        deliveryDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
        totalAmount: totalAmount,
        items: cartItems.map((cartItem) => ({
          product: cartItem.product._id,
          quantity: cartItem.quantity,
          price: cartItem.product.offerPrice,
          status: "Confirmed",
          paymentMethod: "Online Payment",
          paymentStatus: "success",
        })),
      });

      await order.save();

    }
    else if (paymentMethod == "CashOnDelivery") {
      const order = new Order({
        user: userId,
        address: address,
        coupon: couponCode,
        randomId: randomId,
        orderDate: new Date(),
        deliveryDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
        totalAmount: totalAmount,
        items: cartItems.map((cartItem) => ({
          product: cartItem.product._id,
          quantity: cartItem.quantity,
          price: cartItem.product.offerPrice,
          status: "Confirmed",
          paymentMethod: "Cash On Delivery",
          paymentStatus: "pending",
        })),
      });

      await order.save();
    }
    cart.items = []; // Clearing items
    cart.totalAmount = 0; // Resetting totalAmount

    await cart.save(); // Save the updated cart

    res.status(200).json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


//   order success- order details page
const loadOrderDetails = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const userData = await User.findById(userId);
    const page = parseInt(req.query.page) || 1; // Get page parameter or default to 1
    const perPage = 10; // Number of items per page
    const offset = (page - 1) * perPage;

    const order = await Order.find({ user: userData._id })
      .populate("user")
      .sort({ orderDate: -1 })
      .populate({
        path: "items.product",
        model: "Product",
      })
      .skip(offset)
      .limit(perPage);

    if (userData) {
      res.render("orderList", { userData, order, currentPage: page });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};



const loadOrderHistory = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const orderId = req.params.id;
    const userData = await User.findById(userId);
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({
        path: "address",
        model: "Address",
      })
      .populate({
        path: "items.product",
        model: "Product",
      });

    res.render("orderDetails", { userData, order });
  } catch (error) {
    console.log(error.message);
  }
};



const orderCancel = async (req, res) => {
  try {
    const orderId = req.query.id;
    const { reason, productId } = req.body;
    const order = await Order.findOne({ _id: orderId })
      .populate("user")
      .populate({
        path: "address",
        model: "Address",
      })
      .populate({
        path: "items.product",
        model: "Product",
      });

    const user_id = order.user._id;

    let totalAmount = order.totalAmount;
    const product = order.items.find(
      (item) => item.product._id.toString() === productId
    );

    const couponData = await Coupon.findOne({ code: order.coupon });

    console.log(couponData);
    if (product && product.product) {

      if (product.status === "Confirmed") {

        product.stock += product.quantity;
        await product.product.save();
      }
      if (
        product.paymentMethod === "Wallet" ||
        product.paymentMethod === "Online Payment"
      ) {
        const walletData = await Wallet.findOne({ user: user_id });
        console.log(walletData);
        if (walletData) {

          walletData.walletBalance += (product.price * product.quantity) - (product.price * product.quantity) * (couponData?.discount != null ? couponData.discount : 0) / 100;

          walletData.transaction.push({
            type: "credit",
            amount: (product.price * product.quantity) - (product.price * product.quantity) * (couponData?.discount != null ? couponData.discount : 0) / 100,
          });
          await walletData.save();
        } else {
          const wallet = new Wallet({
            user: user_id,
            transaction: [{ type: "credit", amount: (product.price * product.quantity) - (product.price * product.quantity) * (couponData?.discount != null ? couponData.discount : 0) / 100 }],
            walletBalance: (product.price * product.quantity) - (product.price * product.quantity) * (couponData?.discount != null ? couponData.discount : 0) / 100
          });
          await wallet.save();
        }
        product.paymentStatus = "Refunded";
      } else {
        product.paymentStatus = "Declined";
      }
      product.status = "Cancelled";
      product.reason = reason;
      totalAmount = totalAmount - ((product.price * product.quantity) - (product.price * product.quantity) * (couponData?.discount != null ? couponData.discount : 0) / 100);
    }

    const updateData = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          items: order.items,
          totalAmount
        },
      },
      { new: true }
    );

    return res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while cancelling the order" });
  }
};

const returnData = async (req, res) => {
  try {
    // Retrieve necessary data from the request
    const orderId = req.query.id;
    const { reason, productId } = req.body;

    // Fetch the order details including user, address, and items
    const order = await Order.findOne({ _id: orderId })
      .populate("user")
      .populate({
        path: "address",
        model: "Address",
      })
      .populate({
        path: "items.product",
        model: "Product",
      });

    // Extract relevant data from the order
    const user_id = order.user._id;
    let totalAmount = order.totalAmount;
    const product = order.items.find(
      (item) => item.product._id.toString() === productId
    );

    // Fetch coupon data related to the order
    const couponData = await Coupon.findOne({ code: order.coupon });

    if (product && product.product) {
      // Check if the product status is "Delivered" to allow return
      if (product.status === "Delivered") {
        // Adjust product details upon return
        product.stock += product.quantity;
        product.status = "Returned";
        product.reason = reason;

        // Update total amount considering refunds
        totalAmount -= (product.price * product.quantity) - ((product.price * product.quantity) * (couponData?.discount != null ? couponData.discount : 0) / 100);

        // Handle payment method and update payment status
        if (
          product.paymentMethod === "Wallet" ||
          product.paymentMethod === "Online Payment"
        ) {
          // Update wallet data accordingly
          // ... (existing logic for wallet update)
          product.paymentStatus = "Refunded";
        } else {
          product.paymentStatus = "Declined";
        }
      } else {
        // If the product status isn't "Delivered", return an error
        return res.status(400).json({ error: "Product status doesn't allow return" });
      }
    }

    // Update the order with the modified item and total amount
    const updateData = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          items: order.items,
          totalAmount,
        },
      },
      { new: true }
    );

    return res.status(200).json({ message: "Order returned successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while returning the order" });
  }
};


const applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    console.log(couponCode, "gjghfh");
    const userId = req.session.user_id;
    const coupon = await Coupon.findOne({ code: couponCode });

    let errorMessage;

    if (!coupon) {
      errorMessage = "Coupon not found";
      return res.json({ errorMessage });
    }

    const currentDate = new Date();

    if (coupon.expiry && currentDate > coupon.expiry) {
      errorMessage = "Coupon Expired";
      return res.json({ errorMessage });
    }


    if (coupon.usersUsed.length >= coupon.limit) {
      errorMessage = "Coupon limit Reached";
      return res.json({ errorMessage });
    }

    if (coupon.usersUsed.includes(userId)) {
      errorMessage = "You already used this coupon";
      return res.json({ errorMessage });
    }

    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.product",
        model: "Product",
      })
      .exec();


    const cartItems = cart.items || [];
    const orderTotal = calcSubtotal(cartItems);

    if (coupon.minAmt > orderTotal) {
      errorMessage = "The amount is less than minimum  amount";
      return res.json({ errorMessage });
    }

    let discountedTotal = 0;

    discountedTotal = calculateDiscountedTotal(orderTotal, coupon.discount);

    if (coupon.maxAmt < discountedTotal) {
      errorMessage = "The Discount cant be applied. It is beyond maximum  amount";
      return res.json({ errorMessage });
    }

    res.status(200).json({ success: true, discountedTotal, message: "return sucessfully" });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
};

// Apply coupon Function
async function applyCoup(couponCode, discountedTotal, userId) {
  const coupon = await Coupon.findOne({ code: couponCode });
  if (!coupon) {
    return discountedTotal;
  }
  const currentDate = new Date();
  if (currentDate > coupon.expiry) {
    return discountedTotal;
  }
  if (coupon.usersUsed.length >= coupon.limit) {
    return discountedTotal;
  }

  if (coupon.usersUsed.includes(userId)) {
    return discountedTotal;
  }

  discountedTotal = calculateDiscountedTotal(
    discountedTotal,
    coupon.discount
  );

  coupon.limit--;
  coupon.usersUsed.push(userId);
  await coupon.save();
  return discountedTotal;
}



module.exports = {
  loadCheckout,
  checkOutPost,
  loadOrderDetails,
  loadOrderHistory,
  orderCancel,
  razorPayOrder,
  returnData,
  applyCoupon
};