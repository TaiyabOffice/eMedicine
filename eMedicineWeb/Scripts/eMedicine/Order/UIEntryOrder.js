
let cart = [];
let products = [];
let rowId = "";
$(document).ready(function () {
    $('#ItemSearch').on('keyup', function () {       
        const query = $(this).val().trim();
        const productList = document.getElementById('product-list');
        if (query.length >= 2) {
            $.ajax({                
                url: '/Order/GetItems',
                method: 'GET',
                data: { item: query },
                dataType: 'json',
                success: function (response) {                                   
                    if (response.data.length > 0)
                    {
                        $("#titleHeder").html("Item Information");                        
                        products = [];
                        products = response.data.map(item => ({
                            id: item.ItemId,
                            name: item.ItemName,
                            price: item.UnitPrice,
                            quantity: 1,
                            mrp: item.MRP,
                            imagePath: item.ImagePath,
                            itemDescription: item.ItemDescription

                        }));                       
                        
                        productList.innerHTML = '';
                        response.data.forEach(item => {
                            const productDiv = document.createElement('div');
                            productDiv.className = 'product';
                            productDiv.innerHTML =
                                '<img src="' + item.ImagePath + '" alt="' + item.ItemName + '">' +
                                '<div class="product-details">' +
                                '<h3>' + item.ItemName + '</h3>' +                               
                                '<p>' + item.ItemDescription + '</p>' +
                                '<p>Price: $' + item.UnitPrice + '</p>' +
                                '<p>MRP: $' + item.MRP + '</p>' +
                                '</div>' +
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
            $("#titleHeder").html("");  
            productList.innerHTML = '';
            products = [];          
        }
    });

    OrderHelper.loadCartFromCache();   
    $("#btnSaveOrder").click(function () {
        OrderHelper.saveOrderList()
    });
    $("#btnClear").click(function () {
        OrderHelper.clearCart()
    });

    $("#mdlShow").click(function () {
        const cartItems = OrderHelper.getCartItems();
        if (cartItems.length == 0) {
            swal({
                title: "Sorry!",
                text: "Please Add item to Cart",
                type: "error",
                closeOnConfirm: false,
                //timer: 2000
            });
            return;
        }
        $("#modal-default").modal("show");
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
    addToCart: function (productId) {
        const product = products.find(p => p.id == productId);

        if (product) {
            const cartItem = cart.find(item => item.id == productId);
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
            this.saveCartToCache();
        } else {
            console.error('Product not found:', productId);
        }
    },
    updateCart: function () {
        const cartItemsTableBody = document.getElementById('cart-items');
        const cartBadge = document.getElementById('cart-badge'); 
        const cartTotal = document.getElementById('cart-total');
        cartItemsTableBody.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const cartItemRow = document.createElement('tr');
            cartItemRow.setAttribute('data-id', item.id);
            cartItemRow.innerHTML =
                '<td class="item-name">' + item.name + '</td>' +
                '<td class="item-price">$' + item.price + '</td>' +
                '<td class="item-quantity">' + item.quantity + '</td>' +
                '<td>' +
            '<button onclick="OrderHelper.IncreseQuantity(' + item.id + ')">+</button> &nbsp; ' +
                '<button onclick="OrderHelper.decreaseQuantity(' + item.id + ')">-</button> &nbsp;' +
                '<button class="fa fa-trash-o" style="font-size:20px;color:red" onclick="OrderHelper.removeFromCart(' + item.id + ')"></button>' +
                '</td>';                
            cartItemsTableBody.appendChild(cartItemRow);            
            total += item.price * item.quantity;
        });
        const totalRow = document.createElement('tr');
        totalRow.className = 'total-row';
        totalRow.innerHTML =
            '<td colspan="3" class="total-label">Total:</td>' +
            '<td class="total-value">$' + total.toFixed(2) + '</td>';            
        cartItemsTableBody.appendChild(totalRow);              
        cartBadge.textContent = cart.length;
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
    IncreseQuantity: function (productId) {
        const cartItem = cart.find(item => item.id == productId);

        if (cartItem) {
            cartItem.quantity += 1;
            if (cartItem.quantity > 0) {
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
        const cartRows = document.querySelectorAll('#cart-items tr');
        cartRows.forEach(row => {            
            const nameCell = row.querySelector('.item-name');
            const priceCell = row.querySelector('.item-price');
            const quantityCell = row.querySelector('.item-quantity');
            
            if (nameCell && priceCell && quantityCell) {
                const cartItem = {
                    OrderId: "000000000000",
                    ItemId: row.getAttribute('data-id'),
                    Name: nameCell.textContent.trim(),
                    UnitPrice: parseFloat(priceCell.textContent.replace('$', '').trim()),
                    Quantity: parseInt(quantityCell.textContent.trim(), 10),
                    OrderdBy: $('#hdnUserId').val(),
                    OrderdDate: $('#hdnDateToday').val()
                };

                cartItems.push(cartItem);
            }
        });
        return cartItems;
    },


    saveOrderList: function () {
        const cartItems = OrderHelper.getCartItems();
        if (cartItems.length == 0)
        {
            swal({
                title: "Sorry!",
                text: "No Items Found!",
                type: "error",
                closeOnConfirm: false,
                //timer: 2000
            });
            return;
        }
        $.ajax({
            url: '/Order/SaveOrderList',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(cartItems),
            success: function (response) {
                if (response.success) {
                    swal({
                        title: "Congratulations",
                        text: "Saved successfully!",
                        type: "success",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        timer: 2000
                    });
                    OrderHelper.clearCart()
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Saved Failde!",
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
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
        //alert('Your cart has been cleared!');
    },

};


