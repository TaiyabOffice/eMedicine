
// Example product data (you'd typically fetch this from an API)
const products = [
  { id: 1, name: 'Basmati Rice', price: 20 },
  { id: 2, name: 'Jasmine Rice', price: 18 },
  { id: 3, name: 'Brown Rice', price: 15 }
];

let cart = []; // Cart items

// Load cart from localStorage
function loadCartFromCache() {
  const cachedCart = localStorage.getItem('cart');
  if (cachedCart) {
    cart = JSON.parse(cachedCart);
  }
}

// Save cart to localStorage
function saveCartToCache() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Render products
function renderProducts() {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';
  
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = 
      '<h3>' + product.name + '</h3>' +
      '<p>Price: $' + product.price + '</p>' +
      '<button onclick="addToCart(' + product.id + ')">Add to Cart</button>';
    
    productList.appendChild(productDiv);
  });
}

// Add product to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  
  if (!product) return alert('Product not found!');
  
  // Check if the product is already in the cart
  const cartItem = cart.find(item => item.id === productId);
  
  if (cartItem) {
    cartItem.quantity += 1; // Increment quantity
  } else {
    cart.push({ ...product, quantity: 1 }); // Add new item
  }
  
  saveCartToCache();
  updateCartUI();
}

// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCartToCache();
  updateCartUI();
}

// Update cart UI
function updateCartUI() {
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');
  
  cartItemsDiv.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalSpan.textContent = '0';
    return;
  }
  
  let total = 0;
  
  cart.forEach(item => {
    total += item.price * item.quantity;
    
    const cartItemDiv = document.createElement('div');
    cartItemDiv.innerHTML = 
      item.name + ' - $' + item.price + ' x ' + item.quantity +
      '<button onclick="removeFromCart(' + item.id + ')">Remove</button>';
    
    cartItemsDiv.appendChild(cartItemDiv);
  });
  
  cartTotalSpan.textContent = total.toFixed(2);
}

// Initialize
loadCartFromCache();
renderProducts();
updateCartUI();
