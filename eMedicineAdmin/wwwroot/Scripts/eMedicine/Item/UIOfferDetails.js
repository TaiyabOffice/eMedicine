let cart = [];
let rowId = "";
$(document).ready(function () {

    ItemListHelper.GetallItems(ItemListHelper.GetUrlVars()["OfferId"]);

    $("#btnClear").click(function () {
        ItemListHelper.clearCart()
    });

    $("#btnBack").click(function () {
        var detailsPageUrl = `/DashBoard/DashBoard`;
        window.location.href = detailsPageUrl;
    });
});
var ItemListHelper =
{
    GetallItems: function (OfferId) {
        const productList = document.getElementById('product-list');
        var jsonParam = { OfferId: OfferId };
        var serviceUrl = "/Item/GetItemsByOfferId";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                console.log(response.data1);
                if (response.data1.length > 0)
                {
                    $("#titleHeder").html("Products ( " + response.data1.length + " )");                    
                    productList.innerHTML = ''; {
                        response.data1.forEach(function (item) {
                            const productDiv = document.createElement('div');
                            productDiv.className = 'product';
                            productDiv.innerHTML =
                                '<img src="' + item.ImagePath + '" alt="' + item.ItemName + '">' +
                                '<div class="product-details">' +
                                '<h3>' + item.ItemName + '</h3>' +
                                '<p>' + item.ItemDescription + '</p>' +
                                '<p class="product-price">Best Price: ৳' + item.UnitPrice + '</p>' +
                                '</div>' +
                                '<button class="btn btn-success" onclick="OrderHelper.ViewDetails(' + item.ItemId + ')">View Details</button>';

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
    },
    GetUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
};


