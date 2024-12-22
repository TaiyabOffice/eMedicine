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

    OfferHelper.GenerateCombo($("#cmbUnitId"), "SP_SelectGetAllDropDown", "GETALLUNIT", "0", "0", "0", "0", "0");
});
$("#btnSave").click(function (event) {
    event.preventDefault();
    OfferHelper.SaveCollectionData();
});
$("#btnUpdate").click(function (event) {
    event.preventDefault();
    OfferHelper.UpdateCollectionData();
});
$("#btnClear").click(function (event) {
    event.preventDefault();
    location.reload();
});

var OfferHelper = {
    GenerateCombo: function (objcmb, proName, callName, param1, param2, param3, param4, param5) {

        objcmb.empty();
        var json = { ProcedureName: proName, CallName: callName, Param1: param1, Param2: param2, Param3: param3, Param4: param4, Param5: param5 };
        jQuery.ajax({
            type: "POST",
            url: "/Common/GenerateCombo",
            data: json,
            success: function (data) {
                if (data.data.length == 1) {
                    $.each(data.data, function (key, Offer) {
                        objcmb.append($("<option></option>").attr("value", Offer.Id).text(Offer.Name));
                    });
                }
                else {
                    objcmb.append($("<option></option>").attr("value", "").text("-Select-"));
                    $.each(data.data, function (key, Offer) {
                        objcmb.append($("<option></option>").attr("value", Offer.Id).text(Offer.Name));
                    });

                }
                // this is for to work onchange event when only one data is returned
                objcmb.change();
            }
        });
    },
    BuildTbl: function (tbldata) {
        $('#tblOffer').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },
                {
                    "data": "ImagePath",
                    "render": function (data, type, row) {
                        if (data) {
                            return '<img src="' + data + '" alt="Offer Image" style="width:50px; height:auto;"/>';
                        }
                        return '<span>No image</span>';
                    }
                },
                { data: 'OfferId' },
                { data: 'OfferName' },
                { data: 'OfferDescription' },
                { data: 'OfferCategoryName' },
                { data: 'UnitName' },                
                { data: 'UnitPrice' },                
                { data: 'MRP' },                
                { data: 'BrandName' },
                { data: 'SupplierName' },                              
                { data: 'IsActive' },                
                {
                    data: null,
                    render: function (data, type, row) {
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OfferHelper.GetOfferID(\'' + row.OfferId + '\')" class="btn btn-sm btn-danger"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button><button id="btnDetails" name="btnDetails" type="button" title="Details" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OfferHelper.GetDetailsByOfferID(\'' + row.OfferId + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-eye" style="font-size:15px; padding:0px;"></i></button>';
                    }
                }
            ],
            "columnDefs": [
                {
                    "targets": [0],
                    "width": "2%",
                    render: function (data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1; },
                },
                { "targets": [1], "width": "10%" }, // Image Column
                { "className": "dt-center", "targets": [0, 10] },
                { "className": "dt-center", "targets": [] },
                { "className": "dt-left", "targets": [] },
                { "targets": [], "visible": false, "searchable": false },

            ]
        });
    },
    SaveCollectionData: function () {
        if ($("#validateOffer").valid()) {
            var formData = new FormData();
           
            formData.append("OfferId", $('#txtOfferId').val() || "000000000000");
            formData.append("OfferName", $('#txtName').val());
            formData.append("OfferNameBN", $('#txtNameBN').val());
            formData.append("OfferDescription", $('#txtDescription').val());
            formData.append("OfferDescriptionBN", $('#txtDescriptionBN').val());
            formData.append("UnitPrice", $('#txtUnitPrice').val());
            formData.append("MRP", $('#txtMRP').val());
            formData.append("BrandId", $('#cmbBrandId').val());
            formData.append("BrandName", $('#cmbBrandId').val());
            formData.append("UnitId", $('#cmbUnitId').val());
            formData.append("UnitName", $('#cmbUnitId').val());
            formData.append("SupplierId", $('#cmbSupplierId').val());
            formData.append("SupplierName", $('#cmbSupplierId').val());
            formData.append("OfferCategoryId", $('#cmbCategoryId').val());
            formData.append("OfferCategoryName", $('#cmbCategoryId').val());
            formData.append("IsActive", $('#CmbIsActive').val());
            formData.append("CreatedBy", $('#hdnUserId').val());
            formData.append("CreatedDate", $('#hdnDateToday').val());
            formData.append("UpdatedBy", $('#hdnUserId').val());
            formData.append("UpdatedDate", $('#hdnDateToday').val());

            
            var fileInput = $('#fileUpload')[0];
            if (fileInput.files.length > 0) {
                formData.append("imageFile", fileInput.files[0]);
            }

            
            $.ajax({
                url: '/Offer/CreateOffer', 
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

                        OfferHelper.GetAllOffer();
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
    UpdateCollectionData: function ()
    {
        if ($("#validateOffer").valid()) {
            var formData = new FormData();
            // Collect form data
            formData.append("OfferId", $('#txtOfferId').val());
            formData.append("OfferName", $('#txtName').val());
            formData.append("OfferNameBN", $('#txtNameBN').val());
            formData.append("OfferDescription", $('#txtDescription').val());
            formData.append("OfferDescriptionBN", $('#txtDescriptionBN').val());
            formData.append("UnitPrice", $('#txtUnitPrice').val());
            formData.append("MRP", $('#txtMRP').val());
            formData.append("BrandId", $('#cmbBrandId').val());
            formData.append("BrandName", $('#cmbBrandId').val());
            formData.append("UnitId", $('#cmbUnitId').val());
            formData.append("UnitName", $('#cmbUnitId').val());
            formData.append("SupplierId", $('#cmbSupplierId').val());
            formData.append("SupplierName", $('#cmbSupplierId').val());
            formData.append("OfferCategoryId", $('#cmbCategoryId').val());
            formData.append("OfferCategoryName", $('#cmbCategoryId').val());
            formData.append("IsActive", $('#CmbIsActive').val());
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
                url: '/Offer/UpdateOfferById',
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

                        OfferHelper.GetAllOffer();
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
        var caratPos = OfferHelper.getSelectionStart(el);
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
    ValidateOffer: function () {
        $.validator.addMethod("notZero", function (value, element) {
            return this.optional(element) || value != ""; 
        }, "Please select a valid option");

        $("#validateOffer").validate({
            rules: {
                txtName: "required",
                txtDescription: "required",                
                txtNameBN: "required",
                txtDescriptionBN: "required",                
                txtUnitPrice: "required",                
                txtMRP: "required",                
                fileUpload: "required",                
                cmbBrandId: {
                    required: true,
                    notZero: "" 
                },
                cmbCategoryId: {
                    required: true,
                    notZero: "" 
                },
                cmbUnitId: {
                    required: true,
                    notZero: ""
                },
                cmbSupplierId: {
                    required: true,
                    notZero: ""
                },                
                CmbIsActive: "required"
            },
            messages: {
                txtName: "Offer Name is required",
                txtDescription: "Offer Description is required",                
                txtUnitPrice: "Offer Unit Price is required",                
                txtMRP: "Offer MRP is required",                
                fileUpload: "File is  required",                
                txtNameBN: "নাম প্রয়োজন",
                txtDescriptionBN: "বর্ণনা প্রয়োজন",               
                cmbSupplierId: "Please select a Supplier company",
                cmbBrandId: "Please select a valid Brand name",
                cmbUnitId: "Please select a valid Unit name",
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