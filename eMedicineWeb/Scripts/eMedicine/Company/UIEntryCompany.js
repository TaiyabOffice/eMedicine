let rowId = "";
$(document).ready(function () {
    $(".select2").select2();
    $("#btnSave").show();
    $("#btnUpdate").hide();

    jQuery.ajax({
        url: "/Common/GetCurrentDate",
        type: "POST",
        success: function (result) {
            $("#CreatedDate").datepicker({ format: "dd-M-yyyy", autoclose: true });
            $("#CreatedDate").datepicker('setDate', new Date(result));

            $("#DeletedDate").datepicker({ format: "dd-M-yyyy", autoclose: true });
            $("#DeletedDate").datepicker('setDate', new Date(result));

            $("#hdnDateToday").datepicker({ format: "dd-M-yyyy", autoclose: true });
            $("#hdnDateToday").datepicker('setDate', new Date(result));     
        }
    });

    UICompanyHelper.GenerateCombo($("#cmbDivisionId"),"SP_SelectGetAllDropDown", "GETALLDIVISION", "0", "0", "0", "0", "0");
    UICompanyHelper.BuildComanyTbl("");
    UICompanyHelper.GetAllCompany();
});
$("#btnSave").click(function (event) {
    event.preventDefault();
        UICompanyHelper.SaveCollectionData();
});
$("#btnClear").click(function (event) {
    event.preventDefault();
    location.reload();
});

$("#btnUpdate").click(function (event) {
    event.preventDefault();
    UICompanyHelper.UpdateCollectionData();
    location.reload();
});

var UICompanyHelper = {
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
    //GetAllCompany: function () {
    //    var serviceUrl = "/Company/GetAllCompany";
    //    jQuery.ajax({
    //        url: serviceUrl,
    //        type: "POST",
    //        success: function (result) {
    //            if (result.success) {
    //                UICompanyHelper.BuildComanyTbl(result.data);
    //            } else {
    //                alert(result.message);
    //            }
    //        },
    //        error: function () {
    //            alert("Error retrieving companies.");
    //        }
    //    });
    //},
    GetAllCompany: function () {
        var serviceUrl = "/Company/GetAllCompany";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result) {
                if (result.success) {
                    UICompanyHelper.BuildComanyTbl(result.data);
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
    SaveCollectionData: function () {

        var companyData = {
            CompanyId: $('#CompanyId').val(),
            CompanyName: $('#CompanyName').val(),
            CompanyAddress: $('#CompanyAddress').val(),
            CompanyDescription: $('#CompanyDescription').val(),
            CompanyPhone: $('#CompanyPhone').val(),
            IsActive: $('#IsActive').val(),
            CreatedBy: $('#hdnUserId').val(),
            CreatedDate: $('#hdnDateToday').val(),
            UpdatedBy: $('#hdnUserId').val(),
            DeletedBy: $('#hdnUserId').val(),
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
                UICompanyHelper.GetAllCompany();                
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
            CompanyPhone: $('#CompanyPhone').val(),
            IsActive: $('#IsActive').val(),
            UpdatedBy: $('#hdnUserId').val()
        };

        $.ajax({
            url: '/Company/UpdateCompanyById',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(companyData),
            success: function (response) {
                swal({
                    title: "Success",
                    text: "Company updated successfully!",
                    type: "success",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    timer: 2000
                });
                UICompanyHelper.GetAllCompany();
            },
            error: function (xhr, status, error) {
                swal({
                    title: "Error",
                    text: "Error updating company: " + error,
                    type: "error",
                    closeOnConfirm: false,
                    timer: 2000
                });
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
                }
            ],
            "columnDefs": [
                {
                    "targets": [0],
                    "width": "2%",
                    render: function (data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1; },
                },

                {
                    "targets": [7],
                    "render": function (data, type, row, meta) {
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="UICompanyHelper.GetCompanyID(\'' + row.CompanyId + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button>';

                    }
                },
            ]

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
                if (response.success && response.data01 && response.data01.length > 0) {
                    var company = response.data01[0]; 

                    $('#CompanyId').val(company.CompanyId);
                    $('#CompanyName').val(company.CompanyName);
                    $('#CompanyAddress').val(company.CompanyAddress);
                    $('#CompanyDescription').val(company.CompanyDescription);
                    $('#CompanyPhone').val(company.CompanyPhone);
                    $('#IsActive').val(company.IsActive);
                    $('#CreatedBy').val(company.CreatedBy);
                    $('#CreatedDate').val(company.CreatedDate);
                    $('#UpdatedBy').val(company.UpdatedBy);
                    $('#DeletedBy').val(company.DeletedBy);
                    $('#DeletedDate').val(company.DeletedDate);
                } else { 
                    swal({
                        title: "Sorry!",
                        text: "No company data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        timer: 2000
                    });
                }
            },
            error: function () {
                alert("Error retrieving company data.");
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
        var caratPos = UICompanyHelper.getSelectionStart(el);
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