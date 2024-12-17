
let rowId = "";
$(document).ready(function () {
    DashBoardHelper.GetDetails();
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
};


