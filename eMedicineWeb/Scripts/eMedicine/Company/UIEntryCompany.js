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

    CompanyHelper.GenerateCombo($("#cmbDivisionId"),"SP_SelectGetAllDropDown", "GETALLDIVISION", "0", "0", "0", "0", "0");
    CompanyHelper.BuildComanyTbl("");
    CompanyHelper.GetAllCompany();
});
$("#btnSave").click(function (event) {
    event.preventDefault();
    CompanyHelper.SaveCollectionData();
    location.reload();
});
$("#btnUpdate").click(function (event) {
    event.preventDefault();
    CompanyHelper.UpdateCollectionData();
    location.reload();
});
$("#btnClear").click(function (event) {
    event.preventDefault();
    location.reload();
});

var CompanyHelper = {
    GenerateCombo: function (objcmb, proName, callName, param1, param2, param3, param4, param5) {

        objcmb.empty();
        var json = { ProcedureName: proName, CallName: callName, Param1: param1, Param2: param2, Param3: param3, Param4: param4, Param5: param5 };
        jQuery.ajax({
            type: "POST",
            url: "/Common/GenerateCombo",
            data: json,
            success: function (data) {
                if (data.length == 1) {
                    $.each(data, function (key, item) {
                        objcmb.append($("<option></option>").attr("value", item.Id).text(item.Name));
                    });
                }
                else {
                    objcmb.append($("<option></option>").attr("value", "0").text("-Select-"));
                    $.each(data, function (key, item) {
                        objcmb.append($("<option></option>").attr("value", item.Id).text(item.Name));
                    });

                }
                // this is for to work onchange event when only one data is returned
                objcmb.change();
            }
        });
    },
    BuildComanyTbl: function (tbldata) {
        $('#tblCompany').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            "columns": [
                { "data": "SL" },//0
                { data: 'CompanyId' },//1
                { data: 'CompanyName' },//2
                { data: 'CompanyAddress' },//3
                { data: 'CompanyDescription' },//4
                { data: 'CompanyPhone' },//5               
                { data: 'IsActive' },//6
                {
                    data: null,//7
                    render: function (data, type, row) {
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="CompanyHelper.GetCompanyID(\'' + row.CompanyId + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button>';
                    }
                }
            ],
            "columnDefs": [
                {
                    "targets": [0],
                    "width": "2%",
                    render: function (data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1; },
                }
            ]

        });



    },
    GetAllCompany: function () {
        var serviceUrl = "/Company/GetAllCompany";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result) {
                if (result.Success) {
                    CompanyHelper.BuildComanyTbl(result.data);
                } else {
                    alert(result.message);
                }
            },
            error: function () {
                alert("Error retrieving companies.");
            }
        });
    },  
    SaveCollectionData: function () {

        var companyData = {
            CompanyId: $('#CompanyId').val() ? "" : "000000000000",
            CompanyName: $('#CompanyName').val(),
            CompanyAddress: $('#CompanyAddress').val(),
            CompanyDescription: $('#CompanyDescription').val(),
            CompanyNameBN: $('#CompanyNameBN').val(),
            CompanyAddressBN: $('#CompanyAddressBN').val(),
            CompanyDescriptionBN: $('#CompanyDescriptionBN').val(),
            CompanyPhone: $('#CompanyPhone').val(),
            IsActive: $('#IsActive').val(),
            CreatedBy: $('#hdnUserId').val(),
            CreatedDate: $('#hdnDateToday').val(),
            UpdatedBy: $('#hdnUserId').val(),
            UpdatedDate: $('#hdnDateToday').val()
        };

        // Send the form data to the CreateCompany action via AJAX
        $.ajax({
            url: '/Company/CreateCompany', // Your controller action
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
                CompanyHelper.GetAllCompany();                
            },
            error: function (xhr, status, error) {
                // Handle errors

                swal({
                    title: "Sorry!",
                    text: "Error saving company!" + error,
                    type: "error",
                    closeOnConfirm: false,
                    timer: 2000
                });                
            }
        });
    },

    UpdateCollectionData: function () {

        var companyData = {
            CompanyId: $('#CompanyId').val(),
            CompanyName: $('#CompanyName').val(),
            CompanyAddress: $('#CompanyAddress').val(),
            CompanyDescription: $('#CompanyDescription').val(),
            CompanyNameBN: $('#CompanyNameBN').val(),
            CompanyAddressBN: $('#CompanyAddressBN').val(),
            CompanyDescriptionBN: $('#CompanyDescriptionBN').val(),
            CompanyPhone: $('#CompanyPhone').val(),            
            IsActive: $('#IsActive').val(),
            CreatedBy: $('#hdnUserId').val(),
            CreatedDate: $('#hdnDateToday').val(),
            UpdatedBy: $('#hdnUserId').val(),
            UpdatedDate: $('#hdnDateToday').val()           
        };

        // Send the form data to the CreateCompany action via AJAX
        $.ajax({
            url: '/Company/UpdateCompanyById', // Your controller action
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(companyData), // Send as JSON
            success: function (response) {
                // Success message
                swal({
                    title: "Congratulations",
                    text: "Update successfully!",
                    type: "success",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    timer: 2000
                });
                CompanyHelper.GetAllCompany();
            },
            error: function (xhr, status, error) {
                // Handle errors

                swal({
                    title: "Sorry!",
                    text: "Error Update company!" + error,
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    GetCompanyID: function (CompanyId) {
        $("#btnSave").hide();
        $("#btnUpdate").show();
        var jsonParam = { companyId: CompanyId };
        var serviceUrl = "/Company/GetCompanyById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                if (response.Success) {
                    var company = response.data;
                    $('#CompanyId').val(company.CompanyId);
                    $('#CompanyName').val(company.CompanyName);
                    $('#CompanyAddress').val(company.CompanyAddress);
                    $('#CompanyDescription').val(company.CompanyDescription);
                    $('#CompanyNameBN').val(company.CompanyNameBN);
                    $('#CompanyAddressBN').val(company.CompanyAddressBN);
                    $('#CompanyDescriptionBN').val(company.CompanyDescriptionBN);
                    $('#CompanyPhone').val(company.CompanyPhone);                   
                    $('#IsActive').val(company.IsActive);                   
                } else { 
                    swal({
                        title: "Sorry!",
                        text: "No company data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "No company data found.!",
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
        var caratPos = CompanyHelper.getSelectionStart(el);
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
    }
};