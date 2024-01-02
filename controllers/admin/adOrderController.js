const Order = require("../../model/order");

const Address = require('../../model/address');
const User = require("../../model/userModel");
const Cart = require('../../model/cart');
const Product = require('../../model/product');
const dateFun = require("../../config/dateData")

// Display order list
const listUserOrders = async (req, res) => {
  try {
    const admin = await User.findById(req.session.admin_id);
    const orders = await Order.find()
      .populate("user").sort({ orderDate: -1 })
      .populate({
        path: "address",
        model: "Address",
      })
      .populate({
        path: "items.product",
        model: "Product",
      });
    res.render("adminOrderList", { order: orders, admin });
  } catch (error) {
    console.log(error.message);
  }
};

// Show order details
const listOrderDetails = async (req, res) => {

  try {
    const admin = await User.findById(req.session.admin_id);
    const orderId = req.query.id;
    const order = await Order.findById(orderId)
      .populate("user").sort({ orderDate: -1 })
      .populate({
        path: "address",
        model: "Address",
      })
      .populate({
        path: "items.product",
        model: "Product",
      })
    res.render("adminOrderDetails", { order, admin });
  } catch (error) {
    console.log(error.message);
  }


}

// change order status
const orderStatusChange = async (req, res) => {
  try {
    const orderId = req.query.id;
    const { status, productId } = req.body;

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

    const product = order.items.find(
      (item) => item.product._id.toString() === productId
    );

    if (product) product.status = status;
    if (product.status == 'Delivered') product.paymentStatus = 'success';



    const updateData = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          items: order.items,

        },
      },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "Order status change successfully" });
  } catch (error) {
    console.log(error.message);
    // Handle the error appropriately
    res.status(500).send('Error occurred while updating order status.');
  }
};


// Sales report
const loadSalesReport = async (req, res) => {
  const query = {
    paymentStatus: "success",
    paymentStatus: { $ne: "cancelled" }
  };
  const admin = await User.findById(req.session.admin_id);

  if (req.query.status && req.query.status !== "All") {
    if (req.query.status === "Delivered" || req.query.status === "Shipped" || req.query.status === "Confirmed") {
      query["items.status"] = req.query.status;
    }
  }

  if (req.query.timespan) {
    const dateRange = dateRange(req.query.timespan); // Implement a function to get date range based on timespan
    if (dateRange) {
      query.orderDate = dateRange;
    }
  }

  try {
    let orders = await Order.find(query)
      .populate("user")
      .populate({
        path: "address",
        model: "Address",
      })
      .sort({ orderDate: -1 });

    // Apply order status filter to each order's items
    if (req.query.status && req.query.status !== "All") {
      orders.forEach(order => {
        order.items = order.items.filter(item => item.status === req.query.status);
      });
    }

    // Calculate totals
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalSales = orders.length;
    const totalProductsSold = orders.reduce((acc, order) => acc + order.items.length, 0);

    res.render("salesReport", { orders, totalRevenue, totalSales, totalProductsSold, req, admin });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Error fetching orders");
  }
};





const dateFilter = async (req, res) => {
  const startDate = new Date(req.params.start);
  const endDate = new Date(req.params.end);

  try {
    const orders = await Order.find({
      orderDate: { $gte: startDate, $lt: endDate }
    }).populate("user").populate("address").populate("items.product").sort({ orderDate: -1 });

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalSales = orders.length;
    const totalProductSold = orders.reduce((acc, order) => acc + order.items.length, 0);

    res.status(200).json({
      success: true,
      totalProductSold,
      totalSales,
      totalRevenue,
      orders,
      message: "Returned successfully"
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, error: "Error fetching orders" });
  }
};



const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { saveAs } = require('file-saver');

const createPDF = () => {
  const pdfPath = path.join(__dirname, 'path/to/your/pdf.pdf');
  const doc = new PDFDocument();

  // Set your desired margins (in inches)
  const topMargin = 10;
  const bottomMargin = 1;
  const leftMargin = 2;
  const rightMargin = 2;

  // Pipe the PDF content to a writable stream
  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);

  // Set margins
  doc.page.margins = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };

  // Add content to the PDF
  doc.fontSize(12).text('Your PDF content goes here...', leftMargin, topMargin);

  // Finalize the PDF
  doc.end();

  return pdfPath; // Return the path to the generated PDF
};

const downloadFile = (res, fileType) => {
  let data = null;
  let fileName = '';

  if (fileType === 'pdf') {
    const pdfPath = createPDF();
    data = fs.readFileSync(pdfPath);
    fileName = 'SalesReport.pdf';
    res.setHeader('Content-Type', 'application/pdf');
  } else if (fileType === 'excel') {
    // Replace 'orders' with your data source for Excel file
    const orders = []; // Replace this with your data
    const ws = XLSX.utils.json_to_sheet(orders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
    data = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    fileName = 'SalesReport.xlsx';
    res.setHeader('Content-Type', 'application/octet-stream');
  } else {
    return res.status(400).send('Invalid file type');
  }

  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.status(200).send(data);
};

const downloadPdf = (req, res) => downloadFile(res, 'pdf');
const downloadExcel = (req, res) => downloadFile(res, 'excel');

module.exports = {
  downloadPdf,
  downloadExcel
};





module.exports = {
  listUserOrders,
  listOrderDetails,
  orderStatusChange,
  loadSalesReport,
  downloadPdf,
  dateFilter
}