
let rowId = "";
$(document).ready(function () {
    DashBoardHelper.GetDetails();
    DashBoardHelper.GetAllIOffers();
   
    //$("#offerSlider").on("click", "img", function () {
    //    var imageId = $(this).data("id");

    //    // Change cursor to progress on click
    //    $(this).addClass("clicked");

    //    // Fetch image details
    //    GetImageDetails(imageId).finally(() => {
    //        // Reset cursor after fetching details
    //        $(this).removeClass("clicked");
    //    });
    //});

});
var DashBoardHelper =
{
    GetDetails: function () {

        var serviceUrl = "/DashBoard/GetDashBoardDetails";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (response) {
                if (response.Success) {
                    var data = response.data;
                    console.log(data);
                    $('#TxtNewOrder').html(data[0].DESC13);
                    $('#txtActUser').html(data[0].DESC21);
                    $('#MdlCompanyNameBN').html("কোম্পানির নাম: " + data[0].CompanyNameBN);
                    $('#MdlCompanyAddress').html("Company Address: " + data.CompanyAddress);
                    $('#MdlCompanyAddressBN').html("কোম্পানির ঠিকানা: " + data.CompanyAddressBN);
                    $('#MdlICompanyDescription').html("Description: " + data.CompanyDescription);
                    $('#MdlICompanyDescriptionBN').html("কোম্পানির বিবরণ: " + data.CompanyDescriptionBN);
                    $('#mdlCompanyPhone').html("Company Phone: " + data.CompanyPhone);
                } else {
                    swal({
                        title: "Sorry!",
                        text: "No  data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            }
        });
    },

    GetAllIOffers: function () {
        var serviceUrl = "/Item/GetAllIOffers";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result) {
                if (result.success && result.data) {
                    var offers = result.data; // Assuming result.data is an array of offers
                    var swiperWrapper = $("#offerSlider .swiper-wrapper"); // Swiper wrapper

                    // Create slides dynamically
                    //offers.forEach(function (offer) {
                    //    var slide = `
                    //    <div class="swiper-slide">
                    //        <img src="${offer.OfferImagePath}" alt="${offer.OfferName}" data-id="${offer.OfferId}">
                    //        <div class="offer-details">
                    //            <h4>${offer.OfferName}</h4>
                    //            <p>${offer.OfferDescriptions}</p>
                    //        </div>
                    //    </div>
                    //`;
                    //    swiperWrapper.append(slide);
                    //});

                    offers.forEach(function (offer) {
                        var slide = `
                        <div class="swiper-slide">
                            <img src="${offer.OfferImagePath}" alt="${offer.OfferName}" data-id="${offer.OfferId}">                            
                        </div>
                    `;
                        swiperWrapper.append(slide);
                    });

                    // Initialize Swiper
                    new Swiper("#offerSlider", {
                        loop: true,
                        navigation: {
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        },
                        pagination: {
                            el: ".swiper-pagination",
                            clickable: true,
                        },
                        autoplay: {
                            delay: 3000,
                            disableOnInteraction: false,
                        },
                        slidesPerView: 1,
                        spaceBetween: 10,
                        breakpoints: {
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                        },
                    });

                    // Add click event listener to images
                    $("#offerSlider").on("click", "img", function () {
                       
                        var imageId = $(this).data("id");                        
                        //GetImageDetails(imageId);
                        var detailsPageUrl = `/Item/UIOfferDetails?OfferId=${imageId}`; // Replace with your target page URL
                        window.location.href = detailsPageUrl;
                    });
                } else {
                    console.error("No offers found or result unsuccessful.");
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "Error retrieving items.",
                    type: "error",
                    closeOnConfirm: false,
                });
            }
        });
    }
    

};


