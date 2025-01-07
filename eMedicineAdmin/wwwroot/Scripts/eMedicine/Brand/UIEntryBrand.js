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

    BrandHelper.GenerateCombo($("#cmbCompanyId"), "SP_SelectGetAllDropDown", "GETALLCOMPANY", "0", "0", "0", "0", "0");
    BrandHelper.GenerateCombo($("#cmbGenericId"), "SP_SelectGetAllDropDown", "GETALLGENERIC", "0", "0", "0", "0", "0");
    BrandHelper.GenerateCombo($("#cmbCategoryId"), "SP_SelectGetAllDropDown", "GETALLCATEGORY", "0", "0", "0", "0", "0");
    BrandHelper.BuildTbl("");
    BrandHelper.GetAllBrand();
    BrandHelper.ValidateBrand();

});
$("#btnSave").click(function (event) {
    event.preventDefault();
    BrandHelper.SaveCollectionData();
});
$("#btnUpdate").click(function (event) {
    event.preventDefault();
    BrandHelper.UpdateCollectionData();
});
$("#btnClear").click(function (event) {
    event.preventDefault();
    location.reload();
});

var BrandHelper = {
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
            }
        });
    },
    BuildTbl: function (tbldata) {
        $('#tblBrand').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },
                { data: 'BrandId' },
                { data: 'BrandName' },
                { data: 'GenericName' },
                { data: 'CategoryName' },
                { data: 'CompanyName' },                
                { data: 'DosageForm' },
                { data: 'Strength' },
                { data: 'BrandDescription' },                
                { data: 'IsActive' },
                {
                    data: null,
                    render: function (data, type, row) {
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="BrandHelper.GetBrandID(\'' + row.BrandId + '\')" class="btn btn-sm btn-danger"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button><button id="btnDetails" name="btnDetails" type="button" title="Details" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="BrandHelper.GetDetailsByBrandID(\'' + row.BrandId + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-eye" style="font-size:15px; padding:0px;"></i></button>';
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
                { "targets": [6,7], "visible": false, "searchable": false },

            ]
        });
    },
    SaveCollectionData: function ()
    {
        if ($("#validateBrand").valid()) {
            var BrandData =
            {
                BrandId: $('#txtBrandId').val() ? "" : "000000000000",
                BrandName: $('#txtName').val(),
                BrandNameBN: $('#txtNameBN').val(),
                BrandDescription: $('#txtDescription').val(),
                BrandDescriptionBN: $('#txtDescriptionBN').val(),
                CompanyId: $('#cmbCompanyId').val(),
                CategoryId: $('#cmbCategoryId').val(),
                GenericId: $('#cmbGenericId').val(),
                DosageForm: "N/A",
                DosageFormBN: "প্রয়োজনেই",
                Strength: "N/A",
                StrengthBN: "প্রয়োজনেই",
                GenericName: $('#cmbGenericId').val(),
                CategoryName: $('#cmbCategoryId').val(),
                CompanyName: $('#cmbCompanyId').val(),
                IsActive: $('#CmbIsActive').val(),
                CreatedBy: $('#hdnUserId').val(),
                CreatedDate: $('#hdnDateToday').val(),
                UpdatedBy: $('#hdnUserId').val(),
                UpdatedDate: $('#hdnDateToday').val()
            };
            $.ajax({
                url: '/Brand/CreateBrand', // Your controller action
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(BrandData), // Send as JSON
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

                        BrandHelper.GetAllBrand()
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
                        text: "Error retrieving Brand.!" + error,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            });
        }
        },
    UpdateCollectionData: function ()
    {
        if ($("#validateBrand").valid())
        {

        var BrandData = {
            BrandId: $('#txtBrandId').val(),
            BrandName: $('#txtName').val(),
            BrandNameBN: $('#txtNameBN').val(),
            BrandDescription: $('#txtDescription').val(),
            BrandDescriptionBN: $('#txtDescriptionBN').val(),
            CompanyId: $('#cmbCompanyId').val(),
            CategoryId: $('#cmbCategoryId').val(),
            GenericId: $('#cmbGenericId').val(),
            DosageForm: "N/A",
            DosageFormBN: "প্রয়োজনেই",
            Strength: "N/A",
            StrengthBN: "প্রয়োজনেই",
            GenericName: $('#cmbGenericId').val(),
            CategoryName: $('#cmbCategoryId').val(),
            CompanyName: $('#cmbCompanyId').val(),
            IsActive: $('#CmbIsActive').val(),
            CreatedBy: $('#hdnUserId').val(),
            CreatedDate: $('#hdnDateToday').val(),
            UpdatedBy: $('#hdnUserId').val(),
            UpdatedDate: $('#hdnDateToday').val()
        };
        $.ajax({
            url: '/Brand/UpdateBrandById', // Your controller action
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(BrandData), // Send as JSON
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

                BrandHelper.GetAllBrand();
            },
            error: function (xhr, status, error) {
                swal({
                    title: "Sorry!",
                    text: "Error retrieving Brand.!" + error,
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
        }
    },
    GetAllBrand: function () {
        var serviceUrl = "/Brand/GetAllBrand";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result) {
                if (result.success) {
                    BrandHelper.BuildTbl(result.data);
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving Brands.!" + result.message,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "Error retrieving Brands.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    GetBrandID: function (BrandId) {
        $("#btnSave").hide();
        $("#btnUpdate").show();
        var jsonParam = { BrandId: BrandId };
        var serviceUrl = "/Brand/GetBrandById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                //console.log(response.data);
                if (response.Success) {
                    var Brand = response.data;
                    $('#txtBrandId').val(Brand.BrandId);
                    $('#txtName').val(Brand.BrandName);
                    $('#txtNameBN').val(Brand.BrandNameBN);
                    $('#txtDescription').val(Brand.BrandDescription);
                    $('#txtDescriptionBN').val(Brand.BrandDescriptionBN);
                    $("#cmbCompanyId").val(Brand.CompanyId).select2();
                    $("#cmbCategoryId").val(Brand.CategoryId).select2();
                    $("#cmbGenericId").val(Brand.GenericId).select2();
                    $('#txtDosageForm').val(Brand.DosageForm);
                    $('#txtDosageFormBN').val(Brand.DosageFormBN);
                    $('#txtStrength').val(Brand.Strength);
                    $('#txtStrengthBN').val(Brand.StrengthBN);
                    $('#CmbIsActive').val(Brand.IsActive).select2();
                } else {
                    swal({
                        title: "Sorry!",
                        text: "No Brand data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "No Brand data found.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    GetDetailsByBrandID: function (BrandId) {

        var jsonParam = { BrandId: BrandId };
        var serviceUrl = "/Brand/GetBrandById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                //console.log(response.data);
                if (response.Success) {
                    var Brand = response.data;
                    BrandHelper.clrMdl();
                    $('#mdlTitle').html("Brand Details for: " + Brand.BrandId + " - " + Brand.BrandName + " - " + Brand.BrandNameBN);                    
                    $('#MdlName').html("Name: " + Brand.BrandName);
                    $('#MdlNameBN').html("ব্র্যান্ড নাম: " + Brand.BrandNameBN);
                    $('#MdlDescription').html("Description: " + Brand.BrandDescription);
                    $('#MdlDescriptionBN').html("বর্ণনা: " + Brand.BrandDescriptionBN);
                    $('#MdlDosageForm').html("Dosage Form: " + Brand.DosageForm);
                    $('#MdlDosageFormBN').html("ডোজ ফর্ম: " + Brand.DosageFormBN);
                    $('#MdlStrength').html("Strength: " + Brand.Strength);
                    $('#MdlStrengthBN').html("প্রতিরোধশক্তি: " + Brand.StrengthBN);
                    $('#MdlCompanyName').html("Company Name: " + Brand.CompanyName);
                    $('#MdlGenericName').html("Generic Name: " + Brand.GenericName);
                    $('#MdlCategoryName').html("Category Name: " + Brand.CategoryName);
                    $("#modal-default").modal("show");
                }
                else {
                    swal({
                        title: "Sorry!",
                        text: "No Brand data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            }
        });
    },
    clrMdl: function (o)
    {
        $('#MdlBrandId').html("");
        $('#MdlName').html("");
        $('#MdlNameBN').html("");
        $('#MdlDescription').html("");
        $('#MdlDescriptionBN').html("");        
        $('#MdlDosageForm').html("");
        $('#MdlDosageFormBN').html("");
        $('#MdlStrength').html("");
        $('#MdlStrengthBN').html("");
        $('#MdlCompanyName').html("");
        $('#MdlGenericName').html("");
        $('#MdlCategoryName').html("");
           
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
        var caratPos = BrandHelper.getSelectionStart(el);
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
    ValidateBrand: function () {
        $.validator.addMethod("notZero", function (value, element) {
            return this.optional(element) || value != ""; 
        }, "Please select a valid option");

        $("#validateBrand").validate({
            rules: {
                txtName: "required",
                txtDescription: "required",
                txtDosageForm: "required",
                txtStrength: {
                    required: true,
                },
                txtNameBN: "required",
                txtDescriptionBN: "required",
                txtDosageFormBN: "required",
                txtStrengthBN: {
                    required: true,
                },
                cmbCompanyId: {
                    required: true,
                    notZero: "" 
                },
                cmbGenericId: {
                    required: true,
                    notZero: "" 
                },
                cmbCategoryId: {
                    required: true,
                    notZero: ""
                },
                CmbIsActive: "required"
            },
            messages: {
                txtName: "Brand Name is required",
                txtDescription: "Brand Description is required",
                txtDosageForm: "Dosage Form is required",
                txtStrength: {
                    required: "Strength is required",
                    number: "Please enter a valid number for strength"
                },
                txtNameBN: "ব্র্যান্ড নাম প্রয়োজন",
                txtDescriptionBN: "বর্ণনা প্রয়োজন",
                txtDosageFormBN: "ডোজ ফর্ম প্রয়োজন",
                txtStrengthBN: {
                    required: "প্রতিরোধশক্তি প্রয়োজন",
                },
                cmbCompanyId: "Please select a valid company",
                cmbGenericId: "Please select a valid generic name",
                cmbCategoryId: "Please select a valid Category name",
                CmbIsActive: "Please select the active status"
            },
            errorPlacement: function (label, element) {
                label.addClass('error');
                element.parent().append(label);
            }
        });
    },

};