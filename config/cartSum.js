const calcSubtotal = (cart) => {
       let subtotal = 0;
       for (const cartItem of cart) {
    
        subtotal += cartItem.product.offerPrice * cartItem.quantity;
       }
       return subtotal;
     };
     
     const calcProductTotal = (cart) => {
       const productTotals = [];
       for (const cartItem of cart) {
        const total = cartItem.product.offerPrice * cartItem.quantity;
         productTotals.push(total);
       }
       return productTotals;
     };

     function calculateDiscountedTotal(total, discountPercentage) {
      if (discountPercentage < 0 || discountPercentage > 100) {
        throw new Error('Discount percentage must be between 0 and 100.');
      }
    
      const discountAmount = (discountPercentage / 100) * total;
      const discountedTotal = total - discountAmount;
    
      return discountedTotal;
    };

    function calculateDiscountPrice(originalPrice, discountType, discountValue) {
      if (discountType === 'fixed Amount') {
    
        return originalPrice - discountValue;
      } else if (discountType === 'percentage') {
    
        const discountAmount = (originalPrice * discountValue) / 100;
        return originalPrice - discountAmount;
      } else {
    
        throw new Error('Invalid discount type');
      }
    };
     module.exports = {
      calculateDiscountedTotal,
       calcSubtotal,
       calcProductTotal,
     };  