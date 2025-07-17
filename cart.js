// Cart page functionality for Sweet Delights Bakery
document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCountSpan = document.getElementById("cart-count");
  const subtotalElement = document.getElementById("subtotal");
  const taxElement = document.getElementById("tax");
  const deliveryElement = document.getElementById("delivery");
  const totalElement = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkout-btn");

  let cart = JSON.parse(localStorage.getItem("sweetDelightsCart")) || [];
  const TAX_RATE = 0.085; // 8.5%
  const DELIVERY_FEE = 5.99;

  // Product images mapping
  const productImages = {
    "Chocolate Chip Cookies":
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&h=80&fit=crop",
    "Oatmeal Raisin Cookies":
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=80&h=80&fit=crop",
    "Peanut Butter Cookies":
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=80&h=80&fit=crop",
    "Double Chocolate Cookies":
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop",
    "Sugar Cookies":
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=80&h=80&fit=crop",
    "Snickerdoodle Cookies":
      "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=80&h=80&fit=crop",
    "Vanilla Birthday Cake":
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=80&h=80&fit=crop",
    "Chocolate Fudge Cake":
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=80&h=80&fit=crop",
    "Red Velvet Cake":
      "https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=80&h=80&fit=crop",
    "Lemon Drizzle Cake":
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=80&h=80&fit=crop",
    "Carrot Cake":
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=80&h=80&fit=crop",
    "Strawberry Shortcake":
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=80&h=80&fit=crop",
    "Almond Croissants":
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&h=80&fit=crop",
    "Pain au Chocolat":
      "https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=80&h=80&fit=crop",
    "Cinnamon Rolls":
      "https://images.unsplash.com/photo-1549599762-4d34e2d62c6e?w=80&h=80&fit=crop",
    "Fruit Danish":
      "https://images.unsplash.com/photo-1568876694728-451bbf694b83?w=80&h=80&fit=crop",
    "Chocolate Eclairs":
      "https://images.unsplash.com/photo-1562440499-64c9a5a68aa0?w=80&h=80&fit=crop",
    "French Macarons":
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=80&h=80&fit=crop",
  };

  const updateCartCount = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
  };

  const updateCartSummary = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + (cart.length > 0 ? DELIVERY_FEE : 0);

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    deliveryElement.textContent =
      cart.length > 0 ? `$${DELIVERY_FEE.toFixed(2)}` : "$0.00";
    totalElement.textContent = `$${total.toFixed(2)}`;

    checkoutBtn.disabled = cart.length === 0;
  };

  const saveCart = () => {
    localStorage.setItem("sweetDelightsCart", JSON.stringify(cart));
  };

  const removeFromCart = (productName) => {
    cart = cart.filter((item) => item.name !== productName);
    saveCart();
    renderCart();
    updateCartCount();
    updateCartSummary();
  };

  const updateQuantity = (productName, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productName);
      return;
    }

    const item = cart.find((item) => item.name === productName);
    if (item) {
      item.quantity = parseInt(newQuantity);
      saveCart();
      updateCartSummary();
      updateCartCount();
    }
  };

  const renderCart = () => {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <h3>Your cart is empty</h3>
          <p>Add some delicious treats to get started!</p>
          <a href="index.html" class="cta-button" style="margin-top: 1rem;">Continue Shopping</a>
        </div>
      `;
      return;
    }

    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item">
        <img src="${
          productImages[item.name] || "https://via.placeholder.com/80"
        }" alt="${item.name}" class="item-image">
        <div class="item-details">
          <h4>${item.name}</h4>
          <p>$${item.price.toFixed(2)} each</p>
        </div>
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="updateQuantity('${
            item.name
          }', ${item.quantity - 1})">
            <i class="fas fa-minus"></i>
          </button>
          <input type="number" class="quantity-input" value="${item.quantity}" 
                 onchange="updateQuantity('${item.name}', this.value)" min="1">
          <button class="quantity-btn" onclick="updateQuantity('${
            item.name
          }', ${item.quantity + 1})">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="item-price">$${(item.price * item.quantity).toFixed(
          2
        )}</div>
        <button class="remove-btn" onclick="removeFromCart('${
          item.name
        }')" title="Remove item">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `
      )
      .join("");
  };

  // Make functions global so they can be called from HTML
  window.updateQuantity = updateQuantity;
  window.removeFromCart = removeFromCart;

  // Checkout functionality
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) return;

    // Create a simple checkout modal
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const finalTotal = total + total * TAX_RATE + DELIVERY_FEE;

    modal.innerHTML = `
      <div style="background: white; border-radius: 12px; padding: 2rem; max-width: 400px; width: 90%; text-align: center;">
        <i class="fas fa-check-circle" style="font-size: 3rem; color: #4CAF50; margin-bottom: 1rem;"></i>
        <h3 style="margin-bottom: 1rem;">Order Confirmed!</h3>
        <p style="margin-bottom: 1rem;">Thank you for your order of $${finalTotal.toFixed(
          2
        )}</p>
        <p style="margin-bottom: 2rem; color: #666;">You will receive a confirmation email shortly.</p>
        <button onclick="completeCheckout()" style="background: #ff7f50; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
          Continue Shopping
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    window.completeCheckout = () => {
      cart = [];
      saveCart();
      modal.remove();
      window.location.href = "index.html";
    };
  });

  // Initialize page
  renderCart();
  updateCartCount();
  updateCartSummary();
});
