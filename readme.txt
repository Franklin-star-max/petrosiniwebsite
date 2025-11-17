PETROSINI GLOBAL LIMITED WEBSITE - PRODUCT MANAGEMENT GUIDE
===========================================================

HOW TO ADD PRODUCT IMAGES:
1. Create an 'images' folder in your website directory
2. Add your product images to this folder
3. Recommended image size: 400x300 pixels
4. Supported formats: JPG, PNG, WebP

HOW TO ADD/EDIT PRODUCTS IN CATEGORIES.HTML:
------------------------------------------------
Look for this structure in categories.html:

<!-- Product Card Template -->
<div class="product-card">
    <div class="product-image">
        <!-- REPLACE THIS with your image: -->
        <!-- <img src="images/your-product-image.jpg" alt="Product Name"> -->
        <div class="image-placeholder">Product Image</div>
    </div>
    <div class="product-info">
        <h3 class="product-title">PRODUCT NAME HERE</h3>
        <p class="product-description">PRODUCT DESCRIPTION HERE</p>
        <div class="product-price">
            <span class="current-price">₦PRODUCT PRICE HERE</span>
        </div>
        <button class="btn-add-cart" 
                data-product="PRODUCT NAME" 
                data-price="PRODUCT_PRICE"
                data-image="images/your-image.jpg">
            <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
    </div>
</div>

STEPS TO ADD NEW PRODUCT:
1. Copy a product card section
2. Replace the image placeholder with: <img src="images/your-image.jpg" alt="Product Name">
3. Update product name, description, and price
4. Update the data-product, data-price, and data-image attributes in the button

HOW TO REMOVE PRODUCTS:
Simply delete the entire product card section you want to remove.

FILE STRUCTURE:
- index.html (Homepage)
- about.html (About Us)
- categories.html (All Products)
- contact.html (Contact Page)
- payment.html (Checkout)
- land-details.html (Property Details)
- style.css (All Styles)
- script.js (All Functionality)
- images/ (Folder for all images)

CONTACT INFORMATION (Update in all HTML files):
- Address: 28 Samtam House Near Zenith Bank, Okpanam Road, Asaba, Delta State
- Phone: 08034106285, 0913 313 2537, 0816 853 4156
- Email: Asabamodernmall@gmail.com
- WhatsApp: 08034106285

BUSINESS HOURS (Update in contact.html):
- Monday-Wednesday: 8:00 AM - 6:00 PM
- Thursday: 10:00 AM - 6:00 PM
- Friday: 8:00 AM - 6:00 PM
- Saturday: 9:00 AM - 5:00 PM
- Sunday: Closed

IMPORTANT NOTES:
- Cart data is saved in browser localStorage
- WhatsApp integration works with the main phone number
- All prices should be in numbers only (no commas)
- Test the website on mobile devices
- Update the business logo in about.html

SUPPORT:
For technical support or website modifications, contact your web developer.