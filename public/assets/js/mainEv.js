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



    // function validateProductForm() {
      
    // }
    // function validateCategoryForm() {
    //     console.log("Category is validating");

    //     const categoryNameInput = document.getElementById('category_name');
    //     const categoryNameError = document.getElementById('category_name-error');

    //     const categoryDescriptionInput = document.getElementById('description');
    //     const categoryDescriptionError = document.getElementById('description-error');

    //     const categoryImageInput = document.getElementById('category_image');
    //     const categoryImageError = document.getElementById('category_image-error');

    //     // Reset previous error messages
    //     categoryNameError.textContent = '';
    //     categoryDescriptionError.textContent = '';
    //     categoryImageError.textContent = '';

    //     // Validate Category Name
    //     if (categoryNameInput.value.trim() === '') {
    //         categoryNameError.textContent = 'Category name is required';
    //         categoryNameInput.focus();
    //         return false;
    //     }

    //     // Validate Category Description
    //     if (categoryDescriptionInput.value.trim() === '') {
    //         categoryDescriptionError.textContent = 'Description is required';
    //         categoryDescriptionInput.focus();
    //         return false;
    //     }

    //     // Validate Category Image
    //     if (categoryImageInput.value.trim() === '') {
    //         categoryImageError.textContent = 'Image is required';
    //         categoryImageInput.focus();
    //         return false;
    //     }

    //     return true;
    // }
    // const selectedImages = {};

    // // Function to handle image deletion
    // function deleteImage(imageNumber) {
    //     if (selectedImages[imageNumber]) {
    //         URL.revokeObjectURL(selectedImages[imageNumber].url);
    //         document.getElementById(`image-container${imageNumber}`).innerHTML = '';
    //         document.querySelector(`input[name="image${imageNumber}"]`).value = '';
    //         delete selectedImages[imageNumber];
    //         // Hide the "Delete" button
    //         document.querySelector(`button[onclick="deleteImage(${imageNumber})"]`).style.display = "none";
    //     }
    // }

    // // Function to display selected images when files are selected
    // function displaySelectedImages(imageNumber) {
    //     const fileInput = document.querySelector(`input[name="image${imageNumber}"]`);
    //     const imageContainer = document.getElementById(`image-container${imageNumber}`);
    //     const deleteButton = document.querySelector(`button[onclick="deleteImage(${imageNumber})"]`);
    //     const files = fileInput.files;

    //     // Clear previous previews
    //     imageContainer.innerHTML = '';

    //     for (let i = 0; i < files.length; i++) {
    //         const image = document.createElement('img');
    //         image.src = URL.createObjectURL(files[i]);
    //         image.alt = 'Selected Image';

    //         // Store the image reference for later deletion
    //         selectedImages[imageNumber] = { url: image.src, input: fileInput };

    //         // Append the image to the container
    //         imageContainer.appendChild(image);
    //     }

    //     if (files.length > 0) {
    //         // Show the "Delete" button
    //         deleteButton.style.display = "block";
    //     } else {
    //         // Hide the "Delete" button
    //         deleteButton.style.display = "none";
    //     }
    // }

    // // Trigger image preview when files are selected
    // document.querySelector('input[name="image1"]').addEventListener('change', function () {
    //     displaySelectedImages(1);
    // });
    // document.querySelector('input[name="image2"]').addEventListener('change', function () {
    //     displaySelectedImages(2);
    // });
    // document.querySelector('input[name="image3"]').addEventListener('change', function () {
    //     displaySelectedImages(3);
    // });
    // document.querySelector('input[name="image4"]').addEventListener('change', function () {
    //     displaySelectedImages(4);
    // });
