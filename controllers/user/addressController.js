const User = require('../../model/userModel');
const Address = require('../../model/address'); // Corrected model import

const loadAddress = async (req, res) => {
  try {
    const userId = req.session.user_id;

    const userData = await User.findById(userId);

    if (userData) {
      const addressData = await Address.find({ user: userId }); // Corrected model usage
      res.render("userAddress", { userData, addressData });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
};

// Address adding page
const addAddressPage = async (req, res) => {
  try {
    const userId = req.session.user_id;

    const userData = await User.findById(userId);
    if (userData) {
      res.render("addAddress", { userData, });
    } else {
      res.redirect('/login');
    }


  } catch (error) {
    console.log(error.message);
  }
};

//   Add a new address
const addNewAddress = async (req, res) => {
  try {

    const userId = req.session.user_id;
    const { houseName, street, city, state, pincode } = req.body;
    const address = new Address({
      user: userId,
      houseName,
      street,
      city,
      state,
      pincode,
      is_listed: true
    });
    const addressData = await address.save();
    res.redirect("/address");

  } catch (error) {
    console.log(error.message);
  }
};

//   Edit existing address
const editAddressPage = async (req, res) => {
  try {
    const userId = req.session.user_id;

    const userData = await User.findById(userId);
    const id = req.query.id;
    const address = await Address.findById(id);

    res.render("editAddress", { userData, Address: address });
  } catch (error) {
    console.log(error.message);
  }
};

//   Edit already existing address
const updateAddress = async (req, res) => {
  try {
    const id = req.body.address_id;

    const { houseName, street, city, state, pincode } = req.body;
    const updateData = await Address.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          houseName,
          street,
          city,
          state,
          pincode,
          is_listed: true
        },
      }
    );
    res.redirect("/address");
  }
  catch (error) {
    console.log(error.message);
  }


}

// Delete address 
const deleteAddress = async (req, res) => {
  try {
    const id = req.query.id;
    const addressData = await Address.deleteOne({ _id: id });
    res.redirect("/address");
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  loadAddress,
  addAddressPage,
  addNewAddress,
  editAddressPage,
  updateAddress,
  deleteAddress
};
