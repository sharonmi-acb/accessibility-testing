// Enhanced cart functionality for Sweet Delights Bakery
document.addEventListener("DOMContentLoaded", () => {
  const cartCountSpan = document.getElementById("cart-count");
  let cart = JSON.parse(localStorage.getItem("sweetDelightsCart")) || [];

  const updateCartCount = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
  };

  const addToCart = (productName, price) => {
    const existingItem = cart.find((item) => item.name === productName);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: productName,
        price: parseFloat(price),
        quantity: 1,
      });
    }

    localStorage.setItem("sweetDelightsCart", JSON.stringify(cart));
    updateCartCount();

    // Show success message
    showNotification(`${productName} added to cart!`);
  };

  const showNotification = (message) => {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      z-index: 1000;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  // Add click handlers to all add-to-cart buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productName =
        button.getAttribute("data-product") ||
        button.closest(".product-card").querySelector("h3").innerText;
      const price =
        button.getAttribute("data-price") ||
        button
          .closest(".product-card")
          .querySelector(".price")
          .innerText.replace("$", "");

      addToCart(productName, price);
    });
  });

  // Cart button click handler
  const cartBtn = document.getElementById("cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "cart.html";
    });
  }

  // Initialize cart count on page load
  updateCartCount();
});
