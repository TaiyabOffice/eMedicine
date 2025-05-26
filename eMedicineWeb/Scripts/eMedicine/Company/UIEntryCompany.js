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
    CompanyHelper.ValidateCompany();
});
$("#btnSave").click(function (event) {
    event.preventDefault();
    CompanyHelper.SaveCollectionData();
});
$("#btnUpdate").click(function (event) {
    event.preventDefault();
    CompanyHelper.UpdateCollectionData();
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
                    objcmb.append($("<option></option>").attr("value", "").text("-Select-"));
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
                {
                    "data": "ImagePath",
                    "render": function (data, type, row) {
                        if (data) {
                            return '<img src="' + data + '" alt="Company Image" style="width:50px; height:auto;"/>';
                        }
                        return '<span>No image</span>';
                    }
                },
                { data: 'CompanyId' },//1
                { data: 'CompanyName' },//2
                { data: 'CompanyAddress' },//3
                { data: 'CompanyDescription' },//4
                { data: 'CompanyPhone' },//5               
                { data: 'IsActive' },//6
                {
                    data: null,//7
                    render: function (data, type, row) {
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="CompanyHelper.GetCompanyID(\'' + row.CompanyId + '\')" class="btn btn-sm btn-danger"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button><button id="btnDetails" name="btnDetails" type="button" title="Details" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="CompanyHelper.GetDetailsByCompanyID(\'' + row.CompanyId + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-eye" style="font-size:15px; padding:0px;"></i></button>';
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
    //SaveCollectionData: function () {
    //    if ($("#validateCompany").valid()) {
    //        var companyData = {
    //            CompanyId: $('#CompanyId').val() ? "" : "000000000000",
    //            CompanyName: $('#CompanyName').val(),
    //            CompanyAddress: $('#CompanyAddress').val(),
    //            CompanyDescription: $('#CompanyDescription').val(),
    //            CompanyNameBN: $('#CompanyNameBN').val(),
    //            CompanyAddressBN: $('#CompanyAddressBN').val(),
    //            CompanyDescriptionBN: $('#CompanyDescriptionBN').val(),
    //            CompanyPhone: $('#CompanyPhone').val(),
    //            IsActive: $('#IsActive').val(),
    //            CreatedBy: $('#hdnUserId').val(),
    //            CreatedDate: $('#hdnDateToday').val(),
    //            UpdatedBy: $('#hdnUserId').val(),
    //            UpdatedDate: $('#hdnDateToday').val()
    //        };

    //        $.ajax({
    //            url: '/Company/CreateCompany', // Your controller action
    //            type: 'POST',
    //            contentType: 'application/json',
    //            data: JSON.stringify(companyData), // Send as JSON
    //            success: function (response) {
    //                swal({
    //                    title: "Congratulations",
    //                    text: "saved successfully!",
    //                    type: "success",
    //                    showConfirmButton: false,
    //                    allowOutsideClick: false,
    //                //    timer: 2000
    //                });
    //                location.reload();

    //                CompanyHelper.GetAllCompany();
    //            },
    //            error: function (xhr, status, error) {
    //                swal({
    //                    title: "Sorry!",
    //                    text: "Error saving company!" + error,
    //                    type: "error",
    //                    closeOnConfirm: false,
    //                //    timer: 2000
    //                });
    //            }
    //        });
    //    }
    //},

    SaveCollectionData: function () {
        if ($("#validateCompany").valid()) {
            var formData = new FormData();

            formData.append("CompanyId", $('#CompanyId').val() || "000000000000");
            formData.append("CompanyName", $('#CompanyName').val());
            formData.append("CompanyAddress", $('#CompanyAddress').val());
            formData.append("CompanyDescription", $('#CompanyDescription').val());
            formData.append("CompanyNameBN", $('#CompanyNameBN').val());
            formData.append("CompanyAddressBN", $('#CompanyAddressBN').val());
            formData.append("CompanyDescriptionBN", $('#CompanyDescriptionBN').val());
            formData.append("CompanyPhone", $('#CompanyPhone').val());
            formData.append("IsActive", $('#IsActive').val());
            formData.append("CreatedBy", $('#hdnUserId').val());
            formData.append("CreatedDate", $('#hdnDateToday').val());
            formData.append("UpdatedBy", $('#hdnUserId').val());
            formData.append("UpdatedDate", $('#hdnDateToday').val());

            var fileInput = $('#fileUpload')[0];
            if (fileInput.files.length > 0) {
                formData.append("imageFile", fileInput.files[0]);
            }


            $.ajax({
                url: '/Company/CreateCompany',
                type: 'POST',
                processData: false,
                contentType: false,
                data: formData,
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
                        location.reload();

                        CompanyHelper.GetAllCompany();
                    } else {
                        swal({
                            title: "Sorry!",
                            text: "Save failed!",
                            type: "error",
                            closeOnConfirm: false,
                        });
                    }
                },
                error: function (xhr, status, error) {
                    swal({
                        title: "Sorry!",
                        text: "Error occurred: " + error,
                        type: "error",
                        closeOnConfirm: false,
                    });
                }
            });
        }
    },
    //UpdateCollectionData: function () {
    //    if ($("#validateCompany").valid()) {

    //        var companyData = {
    //            CompanyId: $('#CompanyId').val(),
    //            CompanyName: $('#CompanyName').val(),
    //            CompanyAddress: $('#CompanyAddress').val(),
    //            CompanyDescription: $('#CompanyDescription').val(),
    //            CompanyNameBN: $('#CompanyNameBN').val(),
    //            CompanyAddressBN: $('#CompanyAddressBN').val(),
    //            CompanyDescriptionBN: $('#CompanyDescriptionBN').val(),
    //            CompanyPhone: $('#CompanyPhone').val(),
    //            IsActive: $('#IsActive').val(),
    //            CreatedBy: $('#hdnUserId').val(),
    //            CreatedDate: $('#hdnDateToday').val(),
    //            UpdatedBy: $('#hdnUserId').val(),
    //            UpdatedDate: $('#hdnDateToday').val()
    //        };

    //        // Send the form data to the CreateCompany action via AJAX
    //        $.ajax({
    //            url: '/Company/UpdateCompanyById', // Your controller action
    //            type: 'POST',
    //            contentType: 'application/json',
    //            data: JSON.stringify(companyData), // Send as JSON
    //            success: function (response) {
    //                // Success message
    //                swal({
    //                    title: "Congratulations",
    //                    text: "Update successfully!",
    //                    type: "success",
    //                    showConfirmButton: false,
    //                    allowOutsideClick: false,
    //                    //timer: 2000
    //                });
    //                location.reload();

    //                CompanyHelper.GetAllCompany();
    //            },
    //            error: function (xhr, status, error) {

    //                swal({
    //                    title: "Sorry!",
    //                    text: "Error Update company!" + error,
    //                    type: "error",
    //                    closeOnConfirm: false,
    //                    //timer: 2000
    //                });
    //            }
    //        });
    //    }
    //},

    UpdateCollectionData: function () {
        if ($("#validateCompany").valid()) {
            var formData = new FormData();

            formData.append("CompanyId", $('#CompanyId').val() || "000000000000");
            formData.append("CompanyName", $('#CompanyName').val());
            formData.append("CompanyAddress", $('#CompanyAddress').val());
            formData.append("CompanyDescription", $('#CompanyDescription').val());
            formData.append("CompanyNameBN", $('#CompanyNameBN').val());
            formData.append("CompanyAddressBN", $('#CompanyAddressBN').val());
            formData.append("CompanyDescriptionBN", $('#CompanyDescriptionBN').val());
            formData.append("CompanyPhone", $('#CompanyPhone').val());
            formData.append("IsActive", $('#IsActive').val());
            formData.append("CreatedBy", $('#hdnUserId').val());
            formData.append("CreatedDate", $('#hdnDateToday').val());
            formData.append("UpdatedBy", $('#hdnUserId').val());
            formData.append("UpdatedDate", $('#hdnDateToday').val());
            formData.append("PreImagePath", $('#lblimgPreview').html()); 

            var fileInput = $('#fileUpload')[0];
            if (fileInput.files.length > 0) {
                formData.append("imageFile", fileInput.files[0]);
            }


            $.ajax({
                url: '/Company/UpdateCompanyById',
                type: 'POST',
                processData: false,
                contentType: false,
                data: formData,
                success: function (response) {
                    if (response.success) {
                        swal({
                            title: "Congratulations",
                            text: "Update successfully!",
                            type: "success",
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            timer: 2000
                        });
                        location.reload();

                        CompanyHelper.GetAllCompany();
                    } else {
                        swal({
                            title: "Sorry!",
                            text: "Update failed!",
                            type: "error",
                            closeOnConfirm: false,
                        });
                    }
                },
                error: function (xhr, status, error) {
                    swal({
                        title: "Sorry!",
                        text: "Error occurred: " + error,
                        type: "error",
                        closeOnConfirm: false,
                    });
                }
            });
        }
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
                    $('#lblimgPreview').html(company.ImagePath);
                    if (company.ImagePath) {
                        $('#imgPreview').attr('src', company.ImagePath).show();
                    } else {
                        $('#imgPreview').hide();
                    }
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
    GetDetailsByCompanyID: function (CompanyId) {
      
        var jsonParam = { companyId: CompanyId };
        var serviceUrl = "/Company/GetCompanyById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                if (response.Success) {
                    var company = response.data;
                    CompanyHelper.clrMdl()
                    $('#mdlTitle').html("Company Details for: " + company.CompanyId + " - " + company.CompanyName + " - " + company.CompanyNameBN);
                    $('#MdlCompanyName').html("Company Name: " + company.CompanyName);
                    $('#MdlCompanyNameBN').html("কোম্পানির নাম: " + company.CompanyNameBN);
                    $('#MdlCompanyAddress').html("Company Address: " + company.CompanyAddress);
                    $('#MdlCompanyAddressBN').html("কোম্পানির ঠিকানা: " + company.CompanyAddressBN);
                    $('#MdlICompanyDescription').html("Description: " + company.CompanyDescription);
                    $('#MdlICompanyDescriptionBN').html("কোম্পানির বিবরণ: " + company.CompanyDescriptionBN);                   
                    $('#mdlCompanyPhone').html("Company Phone: " + company.CompanyPhone);
                    if (company.IsActive == "1") {
                        $('#mdlIsActive').html("Status: Active");
                    }
                    else
                    {
                        $('#mdlIsActive').html("Status: InActive");
                    }
                    if (company.ImagePath) {
                        $('#MdlImage').attr("src", company.ImagePath).show();
                    } else {
                        $('#MdlImage').hide(); // Hide the image element if no image is available
                    }
                   
                    $("#modal-default").modal("show");
                } else {
                    swal({
                        title: "Sorry!",
                        text: "No company data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            }
        });
    },
    clrMdl: function (o) {       
        $('#mdlTitle').html("");
        $('#mdlCompanyId').html("");
        $('#mdlCompanyName').html("");
        $('#mdlCompanyAddress').html("");
        $('#mdlCompanyDescription').html("");
        $('#mdlCompanyNameBN').html("");
        $('#mdlCompanyAddressBN').html("");
        $('#mdlCompanyPhone').html("");
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
    },
    ValidateCompany: function () {
        $("#validateCompany").validate({
            rules: {
                CompanyName: "required",
                CompanyAddress: "required",
                CompanyDescription: "required",
                CompanyNameBN: "required",
                CompanyAddressBN: "required",
                CompanyDescriptionBN: "required",
                fileUpload: "required", 
                CompanyPhone: {
                    required: true,
                    digits: true,
                    minlength: 10,
                    maxlength: 15
                },
                IsActive: "required"
            },
            messages: {
                CompanyName: "Company Name is required",
                CompanyAddress: "Company Address is required",
                CompanyDescription: "Company Description is required",
                CompanyNameBN: "কোম্পানির নাম প্রয়োজন",
                CompanyAddressBN: "কোম্পানির ঠিকানা প্রয়োজন",
                CompanyDescriptionBN: "কোম্পানির বিবরণ প্রয়োজন",
                CompanyPhone: {
                    required: "Company Phone is required",
                    digits: "Please enter a valid phone number",
                    minlength: "Phone number must be at least 10 digits",
                    maxlength: "Phone number must not exceed 15 digits"
                },
                fileUpload: "File is  required",
                IsActive: "Please select the active status"
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