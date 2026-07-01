let rowId = "";
$(document).ready(function () {
  
    $(".select2").select2();
    $("#btnSave").show();
    $("#btnUpdate").hide();
    jQuery.ajax({
        url: "/Common/GetCurrentDate",
        type: "POST",
        success: function (result) {
            $("#hdnDateToday").datepicker({ format: "dd-M-yyyy", autoclose: true });
            $("#hdnDateToday").datepicker('setDate', new Date(result));            
        }
    });
  
    ShopHelper.GenerateCombo($("#cmbAreaId"), "SP_SelectGetAllDropDown", "GETALLDISTRICT", "0", "0", "0", "0", "0");  
    ShopHelper.BuildTbl("");
    ShopHelper.GetAllShop();
    ShopHelper.ValidateShop();

});
$("#btnSave").click(function (event) {
    event.preventDefault();
    ShopHelper.SaveCollectionData();
});
$("#btnUpdate").click(function (event) {
    event.preventDefault();
    ShopHelper.UpdateCollectionData();
});
$("#btnClear").click(function (event) {
    event.preventDefault();
    location.reload();
});

$("#cmbAreaId").on("change", function (e) {    
    $("#cmbUpazilasId").empty();
    ShopHelper.GenerateCombo($("#cmbUpazilasId"), "SP_SelectGetAllDropDown", "GETALLUPAZILA", $("#cmbAreaId").val(), "0", "0", "0", "0");
});

var ShopHelper = {
    GenerateCombo: function (objcmb, proName, callName, param1, param2, param3, param4, param5) {

        objcmb.empty();
        var json = { ProcedureName: proName, CallName: callName, Param1: param1, Param2: param2, Param3: param3, Param4: param4, Param5: param5 };
        jQuery.ajax({
            type: "POST",
            url: "/Common/GenerateCombo",
            data: json,
            success: function (data) {
                if (data.data.length == 1) {
                    $.each(data.data, function (key, item) {
                        objcmb.append($("<option></option>").attr("value", item.Id).text(item.Name));
                    });
                }
                else {
                    objcmb.append($("<option></option>").attr("value", "").text("-Select-"));
                    $.each(data.data, function (key, item) {
                        objcmb.append($("<option></option>").attr("value", item.Id).text(item.Name));
                    });

                }
                // this is for to work onchange event when only one data is returned
                objcmb.change();
                objcmb.select2().trigger('change');
            }
        });
    },
    BuildTbl: function (tbldata) {
        $('#tblShop').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },
                { data: 'ShopId' },
                { data: 'ShopName' },
                { data: 'OwnerName' },
                { data: 'ContactNo' },
                { data: 'AreaId' },
                { data: 'AreaName' },
                { data: 'Address' },                          
                { data: 'IsActive' },
                {
                    data: null,
                    render: function (data, type, row) {
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="ShopHelper.GetShopID(\'' + row.ShopId + '\')" class="btn btn-sm btn-danger"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button>';
                    }
                }
            ],
            "columnDefs": [
                {
                    "targets": [0],
                    "width": "2%",
                    render: function (data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1; },
                },                
                { "className": "dt-center", "targets": [] },
                { "className": "dt-left", "targets": [] },
                { "targets": [5], "visible": false, "searchable": false },

            ]

        });

    },
    SaveCollectionData: function () {
        if ($("#validateCompany").valid()) {

            var companyData = {
                ShopId: $('#txtShopId').val() ? "" : "0",
                ShopName: $('#txtShopName').val(),
                OwnerName: $('#txtOwnerName').val(),
                ContactNo: $('#txtPhone').val(),
                AreaId: $('#cmbAreaId').val(),
                AreaName: $('#cmbAreaId').val(),
                UpazilasId: $('#cmbUpazilasId').val(),
                UpazilasName: $('#cmbUpazilasId').val(),
                Address: $('#txtAddress').val(),
                CreditLimit: '5000',
                DueAmount: '0',
                IsActive: $('#CmbIsActive').val(),
                CreatedBy: $('#hdnUserId').val(),
                CreatedDate: $('#hdnDateToday').val(),
                UpdatedBy: $('#hdnUserId').val(),
                UpdatedDate: $('#hdnDateToday').val()
            };

            // Send the form data to the CreateCompany action via AJAX
            $.ajax({
                url: '/SalesPerson/CreateShop', // Your controller action
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(companyData), // Send as JSON
                success: function (response) {
                    // Success message               
                    swal({
                        title: "Congratulations",
                        text: "saved successfully!",
                        type: "success",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        timer: 2000
                    });
                    location.reload();

                    ShopHelper.GetAllShop();
                },
                error: function (xhr, status, error) {
                    // Handle errors
                    alert('Error saving company: ' + error);
                }
            });
        }
    },
    UpdateCollectionData: function () {
        if ($("#validateCompany").valid()) {

            var ShopData = {
                ShopId: $('#txtShopId').val(),
                ShopName: $('#txtShopName').val(),
                OwnerName: $('#txtOwnerName').val(),
                ContactNo: $('#txtPhone').val(),
                AreaId: $('#cmbAreaId').val(),
                AreaName: $('#cmbAreaId').val(),
                UpazilasId: $('#cmbUpazilasId').val(),
                UpazilasName: $('#cmbUpazilasId').val(),
                Address: $('#txtAddress').val(),
                CreditLimit: '5000',
                DueAmount: '0',
                IsActive: $('#CmbIsActive').val(),
                CreatedBy: $('#hdnUserId').val(),
                CreatedDate: $('#hdnDateToday').val(),
                UpdatedBy: $('#hdnUserId').val(),
                UpdatedDate: $('#hdnDateToday').val()
            };

            // Send the form data to the CreateCompany action via AJAX
            $.ajax({
                url: '/SalesPerson/UpdateShopById', // Your controller action
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(ShopData), // Send as JSON
                success: function (response) {
                    // Success message               
                    swal({
                        title: "Congratulations",
                        text: "saved successfully!",
                        type: "success",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                    });
                    location.reload();

                    ShopHelper.GetAllShop();
                },
                error: function (xhr, status, error) {
                    // Handle errors
                    alert('Error saving Sales Person Data: ' + error);
                }
            });
        }
    },
    GetAllShop: function () {
        var serviceUrl = "/SalesPerson/GetAllShop";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result) {
                if (result.success) {
                    console.log(result.data);
                    ShopHelper.BuildTbl(result.data);
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving companies.!" + result.message,
                        type: "error",
                        closeOnConfirm: false,
                        timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "Error retrieving companies.!",
                    type: "error",
                    closeOnConfirm: false,
                    timer: 2000
                });
            }
        });
    },
    GetShopID: function (ShopId) {
        $("#btnSave").hide();
        $("#btnUpdate").show();
        var jsonParam = { ShopId: ShopId };
        var serviceUrl = "/SalesPerson/GetShopById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                if (response.success && response.data01 && response.data01.length > 0) {
                    var Shop = response.data01[0];
                    //$("#cmbCompanyId").empty();
                    $('#txtShopId').val(Shop.ShopId);
                    $('#txtShopName').val(Shop.ShopName);
                    $('#txtOwnerName').val(Shop.OwnerName);
                    $('#txtPhone').val(Shop.ContactNo);                    
                    $('#txtAddress').val(Shop.Address);                    
                    $("#cmbAreaId").val(Shop.AreaId).select2().trigger('change');
                    $("#cmbUpazilasId").val(Shop.UpazilasId).select2();
                    $('#CmbIsActive').val(Shop.IsActive);
                                                    
                } else {
                    swal({
                        title: "Sorry!",
                        text: "No Sales Person data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "No Sales Person data found.!",
                    type: "error",
                    closeOnConfirm: false,
                    timer: 2000
                });
            }
        });
    },  
    getSelectionStart: function (o) {
        if (o.createTextRange) {
            var r = document.selection.createRange().duplicate();
            r.moveEnd('character', o.value.length);
            if (r.text === '') return o.value.length;
            return o.value.lastIndexOf(r.text);
        } else return o.selectionStart;
    },
    isDeciaml: function (el, evt, deci_point) {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        var number = el.value.split('.');
        if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        //just one dot
        if (number.length > 1 && charCode === 46) {
            return false;
        }
        //get the carat position
        var caratPos = ShopHelper.getSelectionStart(el);
        var dotPos = el.value.indexOf(".");
        if (caratPos > dotPos && dotPos > -1 && (number[1].length > deci_point - 1)) {
            return false;
        }
        return true;
    },
    AllowNumbersOnly: function (e) {
        var code = (e.which) ? e.which : e.keyCode;
        if (code > 31 && (code < 48 || code > 57)) {
            e.preventDefault();
        }
    }, 
    ValidateShop: function () {
        $.validator.addMethod("notZero", function (value, element) {
            return this.optional(element) || value != ""; 
        }, "Please select a valid option");

        $("#validateCompany").validate({
            rules: {
                txtShopName: "required",
                txtPhone: {
                    required: true,
                    digits: true,
                    minlength: 10,
                    maxlength: 15
                },
                CmbIsActive: {
                    required: true,
                    notZero: "" 
                }
                ,
                cmbAreaId: {
                    required: true,
                    notZero: ""
                },
                cmbUpazilasId: {
                    required: true,
                    notZero: ""
                },
                txtOwnerName: "required",
                txtAddress: "required"
            },
            messages: {
                txtShopName: "Name is required",
                txtPhone: {
                    required: "Phone Number is required",
                    digits: "Please enter a valid phone number",
                    minlength: "Phone number must be at least 10 digits",
                    maxlength: "Phone number must not exceed 15 digits"
                },               
                cmbAreaId: "Please select a Area",
                cmbUpazilasId: "Please select a Upazilas",
                CmbIsActive: "Please select if the sales person is active",
                txtOwnerName: "Description is required",
                txtAddress: "Address is required"
            },
            errorPlacement: function (label, element) {
                label.addClass('error');
                element.parent().append(label);
            }
        });
    },
    AllowPhoneNumbersOnly: function (e) {
        var code = (e.which) ? e.which : e.keyCode;

        if ((code >= 48 && code <= 57) || code === 43) {
            return true;
        } else if (code === 46) {
            e.preventDefault();
        } else {
            e.preventDefault();
        }
    },
};