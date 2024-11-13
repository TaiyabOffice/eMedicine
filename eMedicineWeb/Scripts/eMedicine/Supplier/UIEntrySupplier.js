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

    SupplierHelper.GenerateCombo($("#cmbCompanyId"), "SP_SelectGetAllDropDown", "GETALLCOMPANY", "0", "0", "0", "0", "0");
    SupplierHelper.BuildTbl("");
    SupplierHelper.GetAllSupplier();
    SupplierHelper.ValidateSupplier();

});
$("#btnSave").click(function (event) {
    event.preventDefault();
    SupplierHelper.SaveCollectionData();
});

$("#btnUpdate").click(function (event) {
    event.preventDefault();
    SupplierHelper.UpdateCollectionData();
});
$("#btnClear").click(function (event) {
    event.preventDefault();
    location.reload();
});

var SupplierHelper = {
    GenerateCombo: function (objcmb, proName, callName, param1, param2, param3, param4, param5) {

        objcmb.empty();
        var json = { ProcedureName: proName, CallName: callName, Param1: param1, Param2: param2, Param3: param3, Param4: param4, Param5: param5 };
        jQuery.ajax({
            type: "POST",
            url: "/Common/GenerateCombo",
            data: json,
            success: function (data)
        {
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
            }
        });
    },
    BuildTbl: function (tbldata) {
        $('#tblSupplier').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },
                { data: 'SupplierId' },
                { data: 'SupplierName' },
                { data: 'ContactPerson' },
                { data: 'SupplierPhone' },
                { data: 'CompanyId' },
                { data: 'CompanyName' },                
                { data: 'Email' },                
                { data: 'IsActive' },
                {
                    data: null,
                    render: function (data, type, row) {
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="SupplierHelper.GetSupplierID(\'' + row.SupplierId + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button>';
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

            ]

        });

    },
    SaveCollectionData: function () {
        if ($("#validateCompany").valid()) {

            var SupplierData = {
                SupplierId: $('#txtSupplierId').val() ? "" : "000000000000",
                SupplierName: $('#txtSupplierName').val(),
                ContactPerson: $('#txtContactPerson').val(),
                SupplierPhone: $('#txtPhone').val(),
                CompanyId: $('#cmbCompanyId').val(),
                CompanyName: $('#cmbCompanyId').val(),
                Email: $('#txtEmail').val(),
                IsActive: $('#CmbIsActive').val(),
                CreatedBy: $('#hdnUserId').val(),
                CreatedDate: $('#hdnDateToday').val(),
                UpdatedBy: $('#hdnUserId').val(),
                UpdatedDate: $('#hdnDateToday').val()
            };
            $.ajax({
                url: '/Supplier/CreateSupplier', // Your controller action
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(SupplierData), // Send as JSON
                success: function (response) {
                    // Success message
                    //console.log(response);
                    if (response.success) {
                        swal({
                            title: "Congratulations",
                            text: "Saved successfully!",
                            type: "success",
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            timer: 2000
                        });
                        location.reload();

                        SupplierHelper.GetAllSupplier()
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
                    // Handle errors
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving supplier.!" + error,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            });
        }
    },
    UpdateCollectionData: function () {
        if ($("#validateCompany").valid()) {

            var SupplierData = {
                SupplierId: $('#txtSupplierId').val(),
                SupplierName: $('#txtSupplierName').val(),
                ContactPerson: $('#txtContactPerson').val(),
                SupplierPhone: $('#txtPhone').val(),
                CompanyId: $('#cmbCompanyId').val(),
                CompanyName: $('#cmbCompanyId').val(),
                Email: $('#txtEmail').val(),
                IsActive: $('#CmbIsActive').val(),
                CreatedBy: $('#hdnUserId').val(),
                CreatedDate: $('#hdnDateToday').val(),
                UpdatedBy: $('#hdnUserId').val(),
                UpdatedDate: $('#hdnDateToday').val()
            };
            $.ajax({
                url: '/Supplier/UpdateSupplierById', // Your controller action
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(SupplierData), // Send as JSON
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

                    SupplierHelper.GetAllSupplier();
                },
                error: function (xhr, status, error) {
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving supplier.!" + error,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            });
        }
    },
    GetAllSupplier: function () {
        var serviceUrl = "/Supplier/GetAllSupplier";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result) {
                if (result.success) {                 
                    SupplierHelper.BuildTbl(result.data);
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving Suppliers.!" + result.message,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "Error retrieving Suppliers.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    GetSupplierID: function (SupplierId) {
        $("#btnSave").hide();
        $("#btnUpdate").show();
        var jsonParam = { SupplierId: SupplierId };
        var serviceUrl = "/Supplier/GetSupplierById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                //console.log(response.data);
                if (response.Success)
                {
                    var Supplier = response.data;                    
                    //$("#cmbCompanyId").empty();
                    $('#txtSupplierId').val(Supplier.SupplierId);
                    $('#txtSupplierName').val(Supplier.SupplierName);
                    $('#txtContactPerson').val(Supplier.ContactPerson);
                    $('#txtPhone').val(Supplier.SupplierPhone);
                    $('#CompanyPhone').val(Supplier.SupplierPhone);
                    $("#cmbCompanyId").val(Supplier.CompanyId).select2();
                    $('#txtEmail').val(Supplier.Email);                                    
                    $('#CmbIsActive').val(Supplier.IsActive);                                    
                } else {
                    swal({
                        title: "Sorry!",
                        text: "No Supplier data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "No Supplier data found.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
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
        var caratPos = SupplierHelper.getSelectionStart(el);
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

    ValidateSupplier: function () {
        $.validator.addMethod("notZero", function (value, element) {
            return this.optional(element) || value != "";
        }, "Please select a valid option");

        $("#validateCompany").validate({
            rules: {
                txtSupplierName: "required",
                txtContactPerson: "required",
                txtPhone: {
                    required: true,
                    digits: true,
                    minlength: 10,
                    maxlength: 15
                },
                txtEmail: {
                    required: true,
                    email: true
                },
                cmbCompanyId: {
                    required: true,
                    notZero: "" 
                },
                CmbIsActive: {
                    required: true,
                    notZero: "" 
                }
            },
            messages: {
                txtSupplierName: "Supplier Name is required",
                txtContactPerson: "Contact Person is required",
                txtPhone: {
                    required: "Phone Number is required",
                    digits: "Please enter a valid phone number",
                    minlength: "Phone number must be at least 10 digits",
                    maxlength: "Phone number must not exceed 15 digits"
                },
                txtEmail: {
                    required: "Email is required",
                    email: "Please enter a valid email address"
                },
                cmbCompanyId: "Please select a valid company",
                CmbIsActive: "Please select if the supplier is active or not"
            },
            errorPlacement: function (label, element) {
                label.addClass('error');
                element.parent().append(label);
            }
        });
    },

};