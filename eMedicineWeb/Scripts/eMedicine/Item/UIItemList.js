let cart = [];
let rowId = "";
$(document).ready(function () {

    ItemListHelper.GetallItems();
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
                    if (response.data.length > 0) {
                        $("#titleHeder").html("Products ( " + response.data.length + " )");

                        products = response.data.map(item => ({
                            id: item.ItemId,
                            name: item.ItemName,
                            price: item.UnitPrice,
                            quantity: 1,
                            mrp: item.MRP,
                            imagePath: item.ImagePath,
                            itemDescription: item.ItemDescription
                        }));
                        productList.innerHTML = ''; {
                            response.data.forEach(function (item) {
                                const productDiv = document.createElement('div');
                                productDiv.className = 'product';
                                productDiv.innerHTML =
                                    '<img src="' + item.ImagePath + '" alt="' + item.ItemName + '">' +
                                    '<div class="product-details">' +
                                    '<h3>' + item.ItemName + '</h3>' +
                                    '<p>' + item.ItemDescription + '</p>' +
                                    '<p class="product-price">Best Price: ৳' + item.UnitPrice + '</p>' +
                                    '</div>' +
                                '<button class="btn" onclick="OrderHelper.ViewDetails(' + item.ItemId + ')">View Details</button>';

                                productList.appendChild(productDiv);
                            });
                        }
                    } else {
                        productList.innerHTML = '<p>No data found.</p>';
                    }
                },
                error: function () {
                    console.error('Search failed.');
                }
            });
        } else {           
            productList.innerHTML = '';
            ItemListHelper.GetallItems();
        }
    });
    $("#btnClear").click(function () {
        ItemListHelper.clearCart()
    });
});
var ItemListHelper =
{
    GetallItems: function () {
        const productList = document.getElementById('product-list');
        var serviceUrl = "/Item/GetAllItem";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (response) {
                if (response.data.length > 0) {
                    $("#titleHeder").html("Products ( " + response.data.length+" )");

                    products = response.data.map(item => ({
                        id: item.ItemId,
                        name: item.ItemName,
                        price: item.UnitPrice,
                        quantity: 1,
                        mrp: item.MRP,
                        imagePath: item.ImagePath,
                        itemDescription: item.ItemDescription
                    }));
                    productList.innerHTML = ''; {
                        response.data.forEach(function (item) {
                            const productDiv = document.createElement('div');
                            productDiv.className = 'product';
                            productDiv.innerHTML =
                                '<img src="' + item.ImagePath + '" alt="' + item.ItemName + '">' +
                                '<div class="product-details">' +
                                '<h3>' + item.ItemName + '</h3>' +
                                '<p>' + item.ItemDescription + '</p>' +
                                '<p class="product-price">Best Price: ৳' + item.UnitPrice + '</p>' +
                                '</div>' +
                            '<button class="btn" onclick="OrderHelper.ViewDetails(' + item.ItemId + ')">View Details</button>';

                            productList.appendChild(productDiv);
                        });
                    }
                } else {
                    productList.innerHTML = '<p>No data found.</p>';
                }
            },
            error: function () {
                console.error('Search failed.');
            }
        });
    }
};


