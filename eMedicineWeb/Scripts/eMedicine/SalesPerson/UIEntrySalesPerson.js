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

    SalesPersonHelper.GenerateCombo($("#cmbCompanyId"), "SP_SelectGetAllDropDown", "GETALLCOMPANY", "0", "0", "0", "0", "0");
    SalesPersonHelper.BuildTbl("");
    SalesPersonHelper.GetAllSalesPerson();
    SalesPersonHelper.ValidateSalesPerson();

});
$("#btnSave").click(function (event) {
    event.preventDefault();
    SalesPersonHelper.SaveCollectionData();
});

$("#btnUpdate").click(function (event) {
    event.preventDefault();
    SalesPersonHelper.UpdateCollectionData();
});
$("#btnClear").click(function (event) {
    event.preventDefault();
    location.reload();
});

var SalesPersonHelper = {
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
                    objcmb.append($("<option></option>").attr("value", "0").text("-Select-"));
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
        $('#tblSalesPerson').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },
                { data: 'SalesPersonId' },
                { data: 'SalesPersonName' },
                { data: 'SalesPersonDescription' },
                { data: 'SalesPersonPhone' },
                { data: 'CompanyId' },
                { data: 'CompanyName' },                
                { data: 'IsActive' },
                {
                    data: null,
                    render: function (data, type, row) {
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="SalesPersonHelper.GetSalesPersonID(\'' + row.SalesPersonId + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button>';
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

            var companyData = {
                SalesPersonId: $('#txtSalesPersonId').val() ? "" : "000000000000",
                SalesPersonName: $('#txtSalesPersonName').val(),
                SalesPersonDescription: $('#txtDescription').val(),
                SalesPersonPhone: $('#txtPhone').val(),
                CompanyId: $('#cmbCompanyId').val(),
                CompanyName: $('#cmbCompanyId').val(),
                IsActive: $('#CmbIsActive').val(),
                CreatedBy: $('#hdnUserId').val(),
                CreatedDate: $('#hdnDateToday').val(),
                UpdatedBy: $('#hdnUserId').val(),
                UpdatedDate: $('#hdnDateToday').val()
            };

            // Send the form data to the CreateCompany action via AJAX
            $.ajax({
                url: '/SalesPerson/CreateSalesPerson', // Your controller action
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

                    SalesPersonHelper.GetAllSalesPerson();
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

            var SalesPersonData = {
                SalesPersonId: $('#txtSalesPersonId').val(),
                SalesPersonName: $('#txtSalesPersonName').val(),
                SalesPersonDescription: $('#txtDescription').val(),
                SalesPersonPhone: $('#txtPhone').val(),
                CompanyId: $('#cmbCompanyId').val(),
                CompanyName: $('#cmbCompanyId').val(),
                IsActive: $('#CmbIsActive').val(),
                CreatedBy: $('#hdnUserId').val(),
                CreatedDate: $('#hdnDateToday').val(),
                UpdatedBy: $('#hdnUserId').val(),
                UpdatedDate: $('#hdnDateToday').val()
            };

            // Send the form data to the CreateCompany action via AJAX
            $.ajax({
                url: '/SalesPerson/UpdateSalesPersonById', // Your controller action
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(SalesPersonData), // Send as JSON
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

                    SalesPersonHelper.GetAllSalesPerson();
                },
                error: function (xhr, status, error) {
                    // Handle errors
                    alert('Error saving Sales Person Data: ' + error);
                }
            });
        }
    },
    GetAllSalesPerson: function () {
        var serviceUrl = "/SalesPerson/GetAllSalesPerson";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result) {
                if (result.success) {
                    console.log(result.data);
                    SalesPersonHelper.BuildTbl(result.data);
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
    GetSalesPersonID: function (SalesPersonId) {
        $("#btnSave").hide();
        $("#btnUpdate").show();
        var jsonParam = { salesPersonId: SalesPersonId };
        var serviceUrl = "/SalesPerson/GetSalesPersonById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                if (response.success && response.data01 && response.data01.length > 0) {
                    var SalesPerson = response.data01[0];
                    $("#cmbCompanyId").empty();
                    $('#txtSalesPersonId').val(SalesPerson.SalesPersonId);
                    $('#txtSalesPersonName').val(SalesPerson.SalesPersonName);
                    $('#txtDescription').val(SalesPerson.SalesPersonDescription);
                    $('#txtPhone').val(SalesPerson.SalesPersonPhone);
                    $('#CompanyPhone').val(SalesPerson.CompanyPhone);
                    $("#cmbCompanyId").append($("<option></option>").attr("value", SalesPerson.CompanyId).text(SalesPerson.CompanyName));
                    $('#CmbIsActive').val(SalesPerson.IsActive);                                    
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
        var caratPos = SalesPersonHelper.getSelectionStart(el);
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
    ValidateSalesPerson: function () {
        $.validator.addMethod("notZero", function (value, element) {
            return this.optional(element) || value != "0"; // Check if value is not '0'
        }, "Please select a valid option");

        $("#validateCompany").validate({
            rules: {
                txtSalesPersonName: "required",
                txtPhone: "required",
                cmbCompanyId: {
                    required: true,
                    notZero: "0"
                },
                CmbIsActive: {
                    required: true,
                    notZero: "0" 
                },
                txtDescription: "required"
            },
            messages: {
                txtSalesPersonName: "Sales Person Name is required",
                txtPhone: "Phone number is required",
                cmbCompanyId: "Please select a company",
                CmbIsActive: "Please select if the sales person is active",
                txtDescription: "Description is required"
            },
            errorPlacement: function (label, element) {
                label.addClass('error');
                element.parent().append(label);
            }
        });
    },

};