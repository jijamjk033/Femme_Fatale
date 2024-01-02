!function(e){"use strict";if(e(".menu-item.has-submenu .menu-link").on("click",function(s){s.preventDefault(),e(this).next(".submenu").is(":hidden")&&e(this).parent(".has-submenu").siblings().find(".submenu").slideUp(200),e(this).next(".submenu").slideToggle(200)}),e("[data-trigger]").on("click",function(s){s.preventDefault(),s.stopPropagation();var n=e(this).attr("data-trigger");e(n).toggleClass("show"),e("body").toggleClass("offcanvas-active"),e(".screen-overlay").toggleClass("show")}),e(".screen-overlay, .btn-close").click(function(s){e(".screen-overlay").removeClass("show"),e(".mobile-offcanvas, .show").removeClass("show"),e("body").removeClass("offcanvas-active")}),e(".btn-aside-minimize").on("click",function(){window.innerWidth<768?(e("body").removeClass("aside-mini"),e(".screen-overlay").removeClass("show"),e(".navbar-aside").removeClass("show"),e("body").removeClass("offcanvas-active")):e("body").toggleClass("aside-mini")}),e(".select-nice").length&&e(".select-nice").select2(),e("#offcanvas_aside").length){const e=document.querySelector("#offcanvas_aside");new PerfectScrollbar(e)}e(".darkmode").on("click",function(){e("body").toggleClass("dark")})}(jQuery);
// Get the current URL
const currentURL = window.location.href;

    // Select all menu links
    const menuLinks = document.querySelectorAll('.menu-link');

    // Loop through the menu links
    menuLinks.forEach((link) => {
        const menuItem = link.parentElement;

        if (currentURL.includes(link.getAttribute('href'))) {
            // Add the "active" class to the parent menu item
            menuItem.classList.add('active');

            // If it's a sub-menu item, also highlight the parent menu item
            if (menuItem.classList.contains('submenu')) {
                menuItem.closest('.menu-item').classList.add('active');
            }
        }
    });



    function validateProductForm() {
        const productTitleInput = document.getElementById('product_title');
        const productTitleError = document.getElementById('product_title-error');

        const productBrandInput = document.getElementById('product_brand');
        const productBrandError = document.getElementById('product_brand-error');

        const productSeriesInput = document.getElementById('product_series');
        const productSeriesError = document.getElementById('product_series-error');

        const productProBandInput = document.getElementById('product_proBand');
        const productProBandError = document.getElementById('product_proBand-error');

        const productGenInput = document.getElementById('product_gen');
        const productGenError = document.getElementById('product_gen-error');

        const productProNameInput = document.getElementById('product_proName');
        const productProNameError = document.getElementById('product_proName-error');

        const productGraphicInput = document.getElementById('product_graphic');
        const productGraphicError = document.getElementById('product_graphic-error');

        const productRAMInput = document.getElementById('product_ram');
        const productRAMError = document.getElementById('product_ram-error');

        const productRAMTypeInput = document.getElementById('product_ramType');
        const productRAMTypeError = document.getElementById('product_ramType-error');

        const productSSDInput = document.getElementById('product_ssd');
        const productSSDError = document.getElementById('product_ssd-error');

        const productROMInput = document.getElementById('product_rom');
        const productROMError = document.getElementById('product_rom-error');

        const productClockInput = document.getElementById('product_clock');
        const productClockError = document.getElementById('product_clock-error');

        const productCoreInput = document.getElementById('product_core');
        const productCoreError = document.getElementById('product_core-error');

        const productSizeInput = document.getElementById('product_size');
        const productSizeError = document.getElementById('product_size-error');

        const productScrTypeInput = document.getElementById('product_scrType');
        const productScrTypeError = document.getElementById('product_scrType-error');

        const productPriceInput = document.getElementById('product_price');
        const productPriceError = document.getElementById('product_price-error');

        const productDiscountInput = document.getElementById('product_discount');
        const productDiscountError = document.getElementById('product_discount-error');

        const productColorInput = document.getElementById('product_color');
        const productColorError = document.getElementById('product_color-error');

        const productImageInput = document.getElementById('product_quantity');
        const productQuantityError = document.getElementById('product_quantity-error');

        // Reset previous error messages
        productTitleError.textContent = '';
        productBrandError.textContent = '';
        productSeriesError.textContent = '';
        productProBandError.textContent = '';
        productGenError.textContent = '';
        productProNameError.textContent = '';
        productGraphicError.textContent = '';
        productRAMError.textContent = '';
        productRAMTypeError.textContent = '';
        productSSDError.textContent = '';
        productROMError.textContent = '';
        productClockError.textContent = '';
        productCoreError.textContent = '';
        productSizeError.textContent = '';
        productScrTypeError.textContent = '';
        productPriceError.textContent = '';
        productDiscountError.textContent = '';
        productColorError.textContent = '';
        productQuantityError.textContent = '';

        // Validate Product Title
        if (productTitleInput.value.trim() === '') {
            productTitleError.textContent = 'Product title is required';
            productTitleInput.focus();
            return false;
        }

        // Validate Product Brand
        if (productBrandInput.value.trim() === '') {
            productBrandError.textContent = 'Brand is required';
            productBrandInput.focus();
            return false;
        }

        // Validate Series Name
        if (productSeriesInput.value.trim() === '') {
            productSeriesError.textContent = 'Series Name is required';
            productSeriesInput.focus();
            return false;
        }

        // Validate Processor Brand
        if (productProBandInput.value.trim() === '') {
            productProBandError.textContent = 'Processor Brand is required';
            productProBandInput.focus();
            return false;
        }

        // Validate Processor Gen
        if (productGenInput.value.trim() === '') {
            productGenError.textContent = 'Processor Gen is required';
            productGenInput.focus();
            return false;
        }

        // Validate Processor Name
        if (productProNameInput.value.trim() === '') {
            productProNameError.textContent = 'Processor Name is required';
            productProNameInput.focus();
            return false;
        }

        // Validate Graphics Card
        if (productGraphicInput.value.trim() === '') {
            productGraphicError.textContent = 'Graphics Card is required';
            productGraphicInput.focus();
            return false;
        }

        // Validate RAM
        if (productRAMInput.value.trim() === '') {
            productRAMError.textContent = 'RAM is required';
            productRAMInput.focus();
            return false;
        }

        // Validate RAM Type
        if (productRAMTypeInput.value.trim() === '') {
            productRAMTypeError.textContent = 'RAM Type is required';
            productRAMTypeInput.focus();
            return false;
        }

        // Validate SSD
        if (productSSDInput.value.trim() === '') {
            productSSDError.textContent = 'SSD is required';
            productSSDInput.focus();
            return false;
        }

        // Validate ROM
        if (productROMInput.value.trim() === '') {
            productROMError.textContent = 'ROM is required';
            productROMInput.focus();
            return false;
        }

        // Validate Clock Speed
        if (productClockInput.value.trim() === '') {
            productClockError.textContent = 'Clock Speed is required';
            productClockInput.focus();
            return false;
        }

        // Validate Number of Cores
        if (productCoreInput.value.trim() === '') {
            productCoreError.textContent = 'Number of Cores is required';
            productCoreInput.focus();
            return false;
        }

        // Validate Screen Size
        if (productSizeInput.value.trim() === '') {
            productSizeError.textContent = 'Screen Size is required';
            productSizeInput.focus();
            return false;
        }

        // Validate Screen Type
        if (productScrTypeInput.value.trim() === '') {
            productScrTypeError.textContent = 'Screen Type is required';
            productScrTypeInput.focus();
            return false;
        }

        // Validate Price
        if (productPriceInput.value.trim() === '') {
            productPriceError.textContent = 'Price is required';
            productPriceInput.focus();
            return false;
        }

        // Validate Discount Price
        if (productDiscountInput.value.trim() === '') {
            productDiscountError.textContent = 'Discount Price is required';
            productDiscountInput.focus();
            return false;
        }

        // Validate Color
        if (productColorInput.value.trim() === '') {
            productColorError.textContent = 'Color is required';
            productColorInput.focus();
            return false;
        }

        // Validate Quantity
        if (productImageInput.value.trim() === '') {
            productQuantityError.textContent = 'Quantity is required';
            productImageInput.focus();
            return false;
        }
        
        return true;
    }



    

    function validateCategoryForm() {
        console.log("Category is validating");

        const categoryNameInput = document.getElementById('category_name');
        const categoryNameError = document.getElementById('category_name-error');

        const categoryDescriptionInput = document.getElementById('description');
        const categoryDescriptionError = document.getElementById('description-error');

        const categoryImageInput = document.getElementById('category_image');
        const categoryImageError = document.getElementById('category_image-error');

        // Reset previous error messages
        categoryNameError.textContent = '';
        categoryDescriptionError.textContent = '';
        categoryImageError.textContent = '';

        // Validate Category Name
        if (categoryNameInput.value.trim() === '') {
            categoryNameError.textContent = 'Category name is required';
            categoryNameInput.focus();
            return false;
        }

        // Validate Category Description
        if (categoryDescriptionInput.value.trim() === '') {
            categoryDescriptionError.textContent = 'Description is required';
            categoryDescriptionInput.focus();
            return false;
        }

        // Validate Category Image
        if (categoryImageInput.value.trim() === '') {
            categoryImageError.textContent = 'Image is required';
            categoryImageInput.focus();
            return false;
        }

        return true;
    }





    const selectedImages = {};

    // Function to handle image deletion
    function deleteImage(imageNumber) {
        if (selectedImages[imageNumber]) {
            URL.revokeObjectURL(selectedImages[imageNumber].url);
            document.getElementById(`image-container${imageNumber}`).innerHTML = '';
            document.querySelector(`input[name="image${imageNumber}"]`).value = '';
            delete selectedImages[imageNumber];
            // Hide the "Delete" button
            document.querySelector(`button[onclick="deleteImage(${imageNumber})"]`).style.display = "none";
        }
    }

    // Function to display selected images when files are selected
    function displaySelectedImages(imageNumber) {
        const fileInput = document.querySelector(`input[name="image${imageNumber}"]`);
        const imageContainer = document.getElementById(`image-container${imageNumber}`);
        const deleteButton = document.querySelector(`button[onclick="deleteImage(${imageNumber})"]`);
        const files = fileInput.files;

        // Clear previous previews
        imageContainer.innerHTML = '';

        for (let i = 0; i < files.length; i++) {
            const image = document.createElement('img');
            image.src = URL.createObjectURL(files[i]);
            image.alt = 'Selected Image';

            // Store the image reference for later deletion
            selectedImages[imageNumber] = { url: image.src, input: fileInput };

            // Append the image to the container
            imageContainer.appendChild(image);
        }

        if (files.length > 0) {
            // Show the "Delete" button
            deleteButton.style.display = "block";
        } else {
            // Hide the "Delete" button
            deleteButton.style.display = "none";
        }
    }

    // Trigger image preview when files are selected
    document.querySelector('input[name="image1"]').addEventListener('change', function () {
        displaySelectedImages(1);
    });
    document.querySelector('input[name="image2"]').addEventListener('change', function () {
        displaySelectedImages(2);
    });
    document.querySelector('input[name="image3"]').addEventListener('change', function () {
        displaySelectedImages(3);
    });
    document.querySelector('input[name="image4"]').addEventListener('change', function () {
        displaySelectedImages(4);
    });
