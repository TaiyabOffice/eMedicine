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

    ItemHelper.GenerateCombo($("#cmbUnitId"), "SP_SelectGetAllDropDown", "GETALLUNIT", "0", "0", "0", "0", "0");
    ItemHelper.GenerateCombo($("#cmbBrandId"), "SP_SelectGetAllDropDown", "GETALLBRAND", "0", "0", "0", "0", "0");
    ItemHelper.GenerateCombo($("#cmbSupplierId"), "SP_SelectGetAllDropDown", "GETALLSUPPLIER", "0", "0", "0", "0", "0");
    ItemHelper.GenerateCombo($("#cmbCategoryId"), "SP_SelectGetAllDropDown", "GETALLITEMCATEGORY", "0", "0", "0", "0", "0");
    ItemHelper.BuildTbl("");
    ItemHelper.GetAllItem();
    ItemHelper.ValidateItem();

});
$("#btnSave").click(function (event) {
    event.preventDefault();
    ItemHelper.SaveCollectionData();
});
$("#btnUpdate").click(function (event) {
    event.preventDefault();
    ItemHelper.UpdateCollectionData();
});
$("#btnClear").click(function (event) {
    event.preventDefault();
    location.reload();
});

var ItemHelper = {
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
                        objcmb.append($("<option></option>").attr("value", item.id).text(item.name));
                    });
                }
                else {
                    objcmb.append($("<option></option>").attr("value", "").text("-Select-"));
                    $.each(data.data, function (key, item) {
                        objcmb.append($("<option></option>").attr("value", item.id).text(item.name));
                    });

                }               
                objcmb.change();
            }
        });
    },
    BuildTbl: function (tbldata) {
        $('#tblItem').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },
                {
                    "data": "imagePath",
                    "render": function (data, type, row) {
                        if (data) {
                            return '<img src="' + data + '" alt="Item Image" style="width:50px; height:auto;"/>';
                        }
                        return '<span>No image</span>';
                    }
                },
                { data: 'itemId' },
                { data: 'itemName' },
                { data: 'itemDescription' },
                { data: 'itemCategoryName' },
                { data: 'unitName' },                
                { data: 'unitPrice' },                
                { data: 'mRP' },                
                { data: 'brandName' },
                { data: 'supplierName' },                              
                { data: 'isActive' },                
                {
                    data: null,
                    render: function (data, type, row) {
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="ItemHelper.GetItemID(\'' + row.itemId + '\')" class="btn btn-sm btn-danger"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button><button id="btnDetails" name="btnDetails" type="button" title="Details" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="ItemHelper.GetDetailsByItemID(\'' + row.itemId + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-eye" style="font-size:15px; padding:0px;"></i></button>';
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
        if ($("#validateItem").valid()) {
            var formData = new FormData();
           
            formData.append("ItemId", $('#txtItemId').val() || "000000000000");
            formData.append("ItemName", $('#txtName').val());
            formData.append("ItemNameBN", $('#txtNameBN').val());
            formData.append("ItemDescription", $('#txtDescription').val());
            formData.append("ItemDescriptionBN", $('#txtDescriptionBN').val());
            formData.append("UnitPrice", $('#txtUnitPrice').val());
            formData.append("OfferPrice", $('#txtUnitPrice').val());
            formData.append("OfferValue", $('#txtUnitPrice').val());
            formData.append("OfferType", $('#txtUnitPrice').val());
            formData.append("MRP", $('#txtMRP').val());
            formData.append("BrandId", $('#cmbBrandId').val());
            formData.append("BrandName", $('#cmbBrandId').val());
            formData.append("UnitId", $('#cmbUnitId').val());
            formData.append("UnitName", $('#cmbUnitId').val());
            formData.append("SupplierId", $('#cmbSupplierId').val());
            formData.append("SupplierName", $('#cmbSupplierId').val());
            formData.append("ItemCategoryId", $('#cmbCategoryId').val());
            formData.append("ItemCategoryName", $('#cmbCategoryId').val());
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
                url: '/Item/CreateItem', 
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

                        ItemHelper.GetAllItem();
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
        if ($("#validateItem").valid()) {
            var formData = new FormData();
            // Collect form data
            formData.append("ItemId", $('#txtItemId').val());
            formData.append("ItemName", $('#txtName').val());
            formData.append("ItemNameBN", $('#txtNameBN').val());
            formData.append("ItemDescription", $('#txtDescription').val());
            formData.append("ItemDescriptionBN", $('#txtDescriptionBN').val());
            formData.append("UnitPrice", $('#txtUnitPrice').val());
            formData.append("OfferPrice", $('#txtUnitPrice').val());
            formData.append("OfferValue", $('#txtUnitPrice').val());
            formData.append("OfferType", $('#txtUnitPrice').val());
            formData.append("MRP", $('#txtMRP').val());
            formData.append("BrandId", $('#cmbBrandId').val());
            formData.append("BrandName", $('#cmbBrandId').val());
            formData.append("UnitId", $('#cmbUnitId').val());
            formData.append("UnitName", $('#cmbUnitId').val());
            formData.append("SupplierId", $('#cmbSupplierId').val());
            formData.append("SupplierName", $('#cmbSupplierId').val());
            formData.append("ItemCategoryId", $('#cmbCategoryId').val());
            formData.append("ItemCategoryName", $('#cmbCategoryId').val());
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
                url: '/Item/UpdateItemById',
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

                        ItemHelper.GetAllItem();
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
    GetAllItem: function () {
        var serviceUrl = "/Item/GetAllItem";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result) {
                if (result.success) {
                    ItemHelper.BuildTbl(result.data);
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving Items.!" + result.message,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "Error retrieving Items.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    GetItemID: function (ItemId) {
        $("#btnSave").hide();
        $("#btnUpdate").show();
        var jsonParam = { ItemId: ItemId };
        var serviceUrl = "/Item/GetItemById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                //console.log(response.data);
                if (response.Success) {
                    var Item = response.data;
                    $('#txtItemId').val(Item.itemId);
                    $('#txtName').val(Item.itemName);
                    $('#txtNameBN').val(Item.itemNameBN);
                    $('#txtDescription').val(Item.itemDescription);
                    $('#txtDescriptionBN').val(Item.itemDescriptionBN);
                    $('#txtUnitPrice').val(Item.unitPrice);
                    $('#txtMRP').val(Item.mRP);                    
                    $("#cmbBrandId").val(Item.brandId).select2();
                    $("#cmbUnitId").val(Item.unitId).select2();
                    $("#cmbSupplierId").val(Item.supplierId).select2();
                    $('#cmbCategoryId').val(Item.itemCategoryId).select2();                   
                    $('#CmbIsActive').val(Item.isActive).select2();
                    $('#lblimgPreview').html(Item.imagePath);
                    if (Item.imagePath) {
                        $('#imgPreview').attr('src', Item.imagePath).show();
                    } else {
                        $('#imgPreview').hide();
                    }
                } else {
                    swal({
                        title: "Sorry!",
                        text: "No Item data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "No Item data found.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    GetDetailsByItemID: function (ItemId) {

        var jsonParam = { ItemId: ItemId };
        var serviceUrl = "/Item/GetItemById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                //console.log(response.data);
                if (response.Success) {
                    var Item = response.data;
                    ItemHelper.clrMdl();
                    $('#mdlTitle').html("Item Details for: " + Item.itemId + " - " + Item.itemName + " - " + Item.itemNameBN);                    
                    $('#MdlName').html("Name: " + Item.itemName);
                    $('#MdlNameBN').html("নাম: " + Item.itemNameBN);
                    $('#MdlDescription').html("Description: " + Item.itemDescription);
                    $('#MdlDescriptionBN').html("বর্ণনা: " + Item.itemDescriptionBN);
                    $('#MdlUnitPrice').html("Unit Price: " + Item.unitPrice);
                    $('#MdlMRP').html("MRP: " + Item.mRP);
                    $('#MdlBrandName').html("Brand Name: " + Item.brandName);
                    $('#MdlItemCategoryName').html("Category Name: " + Item.itemCategoryName);
                    $('#MdlUnitName').html("Unit: " + Item.unitName);                   
                    $('#MdlSupplierName').html("Supplier Name: " + Item.supplierName);  
                    if (Item.imagePath) {
                        $('#MdlImage').attr("src", Item.imagePath).show();
                    } else {
                        $('#MdlImage').hide();
                    }
                    $("#modal-default").modal("show");
                }
                else {
                    swal({
                        title: "Sorry!",
                        text: "No Item data found.!",
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
        $('#mdlTitle').html("");
        $('#MdlItemId').html("");
        $('#MdlName').html("");
        $('#MdlNameBN').html("");
        $('#MdlDescription').html("");
        $('#MdlDescriptionBN').html("");
        $('#MdlUnitPrice').html("");
        $('#MdlMRP').html("");
        $('#MdlItemCategoryName').html("");
        $('#MdlUnitName').html("");
        $('#MdlSupplierName').html("");
        $('#MdlBrandName').html("");
           
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
        var caratPos = ItemHelper.getSelectionStart(el);
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
    ValidateItem: function () {
        $.validator.addMethod("notZero", function (value, element) {
            return this.optional(element) || value != ""; 
        }, "Please select a valid option");

        $("#validateItem").validate({
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
                txtName: "Item Name is required",
                txtDescription: "Item Description is required",                
                txtUnitPrice: "Item Unit Price is required",                
                txtMRP: "Item MRP is required",                
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