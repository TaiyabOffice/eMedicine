const products = [
        { id: 1, name: 'Basmati Rice', price: 20 },
        { id: 2, name: 'Jasmine Rice', price: 18 },
        { id: 3, name: 'Brown Rice1', price: 15 },
        { id: 4, name: 'Brown Rice2', price: 15 },
        { id: 5, name: 'Brown Rice3', price: 15 },
        { id: 6, name: 'Brown Rice4', price: 15 },
        { id: 7, name: 'Brown Rice5', price: 15 },
        { id: 8, name: 'Brown Rice6', price: 15 }
];
let cart = [];
// Cart items
let rowId = "";
$(document).ready(function () {  
    
    OrderHelper.loadCartFromCache();
    OrderHelper.renderProducts(); 
    $("#btnSaveOrder").click(function () {
        OrderHelper.saveOrderList()
    });

    $("#btnClear").click(function () {
        OrderHelper.clearCart()
    });
});
var OrderHelper =
{
    loadCartFromCache: function () {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            this.updateCart();
        }
    },
    saveCartToCache: function () {
        localStorage.setItem('cart', JSON.stringify(cart));
    },
    renderProducts: function () {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML =
                '<div>' + product.name + '</div>' +
                '<div>Price: $' + product.price + '</div>' +
                '<button onclick="OrderHelper.addToCart(' + product.id + ')">Add to Cart</button>';
            productList.appendChild(productDiv);
        });
    }, 
    addToCart: function (productId) {
        const product = products.find(p => p.id === productId);

        if (product) {            
            const cartItem = cart.find(item => item.id === productId);

            if (cartItem) {               
                cartItem.quantity++;
            } else {              
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                });
            }
            this.updateCart();
        }
        OrderHelper.saveCartToCache();
       
    },
    updateCart: function () {
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        let total = 0;

        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.setAttribute('data-id', item.id);
            cartItemDiv.setAttribute('data-name', item.name);
            cartItemDiv.setAttribute('data-price', item.price);
            cartItemDiv.setAttribute('data-quantity', item.quantity);

            cartItemDiv.innerHTML =
                `<span class="item-name">${item.name}</span> ` +
                `<span class="item-price">$${item.price}</span> ` +
                `<span class="item-quantity">${item.quantity}</span> ` +
                `<button onclick="OrderHelper.addToCart(${item.id})">+</button>`+
                `<button onclick="OrderHelper.decreaseQuantity(${item.id})">-</button>`+
                `<button onclick="OrderHelper.removeFromCart(${item.id})">Remove</button>`;

            cartItemsContainer.appendChild(cartItemDiv);

            total += item.price * item.quantity;
        });      
        document.getElementById('cart-total').textContent = total.toFixed(2);
    },
    decreaseQuantity: function (productId) {
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity -= 1;
            if (cartItem.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.updateCart();
            }
        }
        this.saveCartToCache();
    },
    removeFromCart: function (productId) {
        cart = cart.filter(item => item.id !== productId);
        this.updateCart();
        this.saveCartToCache();
    },
    getCartItems: function () {
        const cartItems = [];      
        document.querySelectorAll('.cart-item').forEach(item => {
            const cartItem = {
                Id: item.getAttribute('data-id'),
                Name: item.getAttribute('data-name'),
                Price: item.getAttribute('data-price'),
                Quantity: item.getAttribute('data-quantity')
            };

            cartItems.push(cartItem);
        });

        console.log(cartItems);
        return cartItems;
    },
    saveOrderList: function () {
        const cartItems = OrderHelper.getCartItems();
        $.ajax({
            url: '/Order/SaveOrderList',
            type: 'POST',
            contentType: 'application/json',           
            data: JSON.stringify(cartItems),
            success: function (response) {
                if (response.success) {
                    alert('Order saved successfully! Order ID: ' + response.orderId);
                } else {
                    alert('Failed to save the order: ' + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error saving order:', error);
                alert('An error occurred while saving the order.');
            }
        });
    },
    clearCart: function () {
        cart = [];
        this.updateCart();
        localStorage.removeItem('cart');
        alert('Your cart has been cleared!');
    },

};


