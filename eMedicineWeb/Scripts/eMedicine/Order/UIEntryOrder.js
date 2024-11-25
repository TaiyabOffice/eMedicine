
let cart = [];
let products = [];
let rowId = "";
$(document).ready(function () {
    $('#ItemSearch').on('keyup', function () {
       
        const query = $(this).val().trim();
        const productList = document.getElementById('product-list');
        if (query.length > 0) {  // Trigger search after 3 characters
            $.ajax({
                //url: '@Url.Action("GetItems", "Order")',
                url: '/Order/GetItems',
                method: 'GET',
                data: { item: query },
                dataType: 'json',
                success: function (response) {                                   
                    if (response.data.length > 0)
                    {
                        products = [];
                        products = response.data.map(item => ({
                            id: item.ItemId,
                            name: item.ItemName,
                            price: item.UnitPrice,
                            quantity: 1,
                            mrp: item.MRP
                        }));                       
                        
                        productList.innerHTML = '';
                        response.data.forEach(item => {
                            const productDiv = document.createElement('div');
                            productDiv.className = 'product';
                            productDiv.innerHTML =
                                '<div>' + item.ItemName + '</div>' +
                                '<div>Price: $' + item.UnitPrice + '</div>' +
                                '<div>MRP: $' + item.MRP + '</div>' +
                                '<button onclick="OrderHelper.addToCart(' + item.ItemId + ')">Add to Cart</button>';
                            productList.appendChild(productDiv);
                        });
                    } else {  
                       
                        productList.appendChild("NO data Found");
                    }
                },
                error: function () {
                    console.error('Search failed.');
                }
            });
        } else {
            productList.innerHTML = '';
            products = [];          
        }
    });


    OrderHelper.loadCartFromCache();
    //OrderHelper.renderProducts();
    $("#btnSaveOrder").click(function () {
        OrderHelper.saveOrderList()
    });

    $("#btnClear").click(function () {
        OrderHelper.clearCart()
    });
});
var OrderHelper = {
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
    //renderProducts: function () {
    //    const productList = document.getElementById('product-list');
    //    productList.innerHTML = '';

    //    products.forEach(product => {
    //        const productDiv = document.createElement('div');
    //        productDiv.className = 'product';
    //        productDiv.innerHTML =
    //            '<div>' + product.name + '</div>' +
    //            '<div>Price: $' + product.price + '</div>' +
    //            '<button onclick="OrderHelper.addToCart(' + product.id + ')">Add to Cart</button>';
    //        productList.appendChild(productDiv);
    //    });
    //},
    addToCart: function (productId) {
        const product = products.find(p => p.id == productId); // Find product by ID

        if (product) {
            const cartItem = cart.find(item => item.id == productId);

            if (cartItem) {
                cartItem.quantity++; // Increment quantity if product is already in cart
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                });
            }
            this.updateCart(); // Update the cart display
            this.saveCartToCache(); // Save updated cart to local storage
        } else {
            console.error('Product not found:', productId);
        }
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
                `<button onclick="OrderHelper.addToCart(${item.id})">+</button>` +
                `<button onclick="OrderHelper.decreaseQuantity(${item.id})">-</button>` +
                `<button onclick="OrderHelper.removeFromCart(${item.id})">Remove</button>`;

            cartItemsContainer.appendChild(cartItemDiv);

            total += item.price * item.quantity;
        });
        document.getElementById('cart-total').textContent = total.toFixed(2);
        document.getElementById('cart-totalItem').textContent = cart.length;;
    },
    decreaseQuantity: function (productId) {
        const cartItem = cart.find(item => item.id == productId);

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
        cart = cart.filter(item => item.id != productId);
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


