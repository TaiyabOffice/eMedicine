let rowId = "";

$(document).ready(function () {

    $(".select2").select2();
    $("#btnSave").show();
    $("#btnUpdate").hide();  

    $("#txtOffeFrom").datepicker({ format: "dd-M-yyyy", autoclose: true });
    $("#txtOffeFrom").datepicker('setDate', new Date());

    $("#txtOffeTo").datepicker({ format: "dd-M-yyyy", autoclose: true });
    $("#txtOffeTo").datepicker('setDate', new Date());

    OfferHelper.BuildTbl("");
    OfferHelper.ValidateOffer();
    OfferHelper.GetAllIOffers();   
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

$("#btnAddTolIst").click(function (event) {
    OfferHelper.SaveOfferItems();
});

$('#SelectAll').on('click', function () {
    var table = $('#tblOfferItems').DataTable();
    var rows = table.rows({ 'search': 'applied' }).nodes();
    $('input[type="checkbox"]', rows).prop('checked', this.checked);
});

$('#tblOfferItems tbody').on('change', 'input[type="checkbox"]', function () {
    if (!this.checked) {
        var el = $('#SelectAll').get(0);
        if (el && el.checked && ('indeterminate' in el)) {
            el.indeterminate = true;
        }
    }
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
                        objcmb.append($("<option></option>").attr("value", Offer.id).text(Offer.name));
                    });
                }
                else {
                    objcmb.append($("<option></option>").attr("value", "").text("-Select-"));
                    $.each(data.data, function (key, Offer) {
                        objcmb.append($("<option></option>").attr("value", Offer.id).text(Offer.name));
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
                    "data": "offerImagePath",
                    "render": function (data, type, row) {
                        if (data) {
                            return '<img src="' + data + '" alt="Offer Image" style="width:50px; height:auto;"/>';
                        }
                        return '<span>No image</span>';
                    }
                },
                { data: 'offerId' },
                { data: 'offerName' },                
                { data: 'startDate' },
                { data: 'endDate' },                
                { data: 'offerType' },                
                { data: 'offerValue' },                
                { data: 'isActive' },                           
                {
                    data: null,
                    render: function (data, type, row) {
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OfferHelper.GetOfferID(\'' + row.offerId + '\')" class="btn btn-sm btn-danger">' +
                            '<i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button>' +
                            '<button id="btnDetails" name="btnDetails" type="button" title="Details" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OfferHelper.GetDetailsByOfferID(\'' + row.offerId + '\')" class="btn btn-sm btn-warning">' +
                            '<i class="fa fa-eye" style="font-size:15px; padding:0px;"></i></button>'+
                        '<button id="btnDetails" name="btnAddItems" type="button" title="Add Items" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OfferHelper.AddOfferItems(\'' + row.offerId + '\')" class="btn btn-sm btn-success">' +
                            '<i class="fa fa-plus" style="font-size:15px; padding:0px;"></i></button>';
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
                { "className": "dt-center", "targets": [] },
                { "className": "dt-center", "targets": [] },
                { "className": "dt-left", "targets": [] },
                { "targets": [], "visible": false, "searchable": false },

            ]
        });
    },
    BuildOfferTbl: function (tbldata) {
        $('#tblOfferItems').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },
                {
                    "data": "isActive",
                    "render": function (data, type, row) {
                        return '<input type="checkbox" id="txtCheck"' + (data == "0" ? '' : ' checked') + '>';
                    }
                },
                {
                    "data": "imagePath",
                    "render": function (data, type, row) {
                        if (data) {
                            return '<img src="' + data + '" alt="Offer Image" style="width:50px; height:auto;"/>';
                        }
                        return '<span>No image</span>';
                    }
                },               
                { data: 'itemId' },
                { data: 'itemName' },
                { data: 'unitName' }
               
            ],
            "columnDefs": [
                {
                    "targets": [0],
                    "width": "2%",
                    render: function (data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1; },
                },
                { "targets": [2], "width": "10%" }, // Image Column
                { "targets": [4], "width": "88%" },
                { "className": "dt-center", "targets": [] },
                { "className": "dt-center", "targets": [] },
                { "className": "dt-left", "targets": [1] },
                { "targets": [3], "visible": false, "searchable": false },

            ]
        });
    },
    BuildDiscountTbl: function (tbldata) {
        $('#tblDiscountItems').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },                
                {
                    "data": "imagePath",
                    "render": function (data, type, row) {
                        if (data) {
                            return '<img src="' + data + '" alt="Offer Image" style="width:50px; height:auto;"/>';
                        }
                        return '<span>No image</span>';
                    }
                },
                { data: 'itemName' },
                { data: 'unitName' },
                { data: 'unitPrice' },
                { data: 'offerType' },
                { data: 'offerValue' },
                { data: 'offerPrice' },
                { data: 'mRP' }

            ],
            "columnDefs": [
                {
                    "targets": [0],
                    "width": "2%",
                    render: function (data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1; },
                },
                { "targets": [1], "width": "10%" },// Image Column
                { "className": "dt-center", "targets": [] },
                { "className": "dt-center", "targets": [] },
                { "className": "dt-left", "targets": [1] },
                { "targets": [], "visible": false, "searchable": false },

            ]
        });
    },
    GetAllIOffers: function () {
        var serviceUrl = "/Item/GetAllIOffers";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result) {
                if (result.success) {
                    OfferHelper.BuildTbl(result.data);
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
    AddOfferItems: function (OfferId) {
        $("#btnAddTolIst").val("");        
        $("#btnAddTolIst").val(OfferId);        
        var jsonParam = { OfferId: OfferId };
        var serviceUrl = "/Item/AddOfferItems";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (result) {
                if (result.success) {
                    OfferHelper.BuildOfferTbl(result.data);
                    $("#modal-AddItem").modal("show");
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
    GetOfferID: function (OfferId) {
        $("#btnSave").hide();
        $("#btnUpdate").show();
        var jsonParam = { OfferId: OfferId };
        var serviceUrl = "/Item/GetOfferById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                //console.log(response.data);
                if (response.success) {
                    var Item = response.data;
                    $('#txtOfferId').val(Item.offerId);
                    $('#txtOfferName').val(Item.offerName);
                    $('#txtNameBN').val(Item.offerNameBN);
                    $('#txtDescription').val(Item.offerDescriptions);
                    $('#txtDescriptionBN').val(Item.offerDescriptionsBN);
                    $('#txtOffeFrom').val(Item.startDate);
                    $('#txtOffeTo').val(Item.endDate);
                    $('#txtOffeValue').val(Item.offerValue);
                    $("#CmbType").val(Item.offerType).select2();                    
                    $('#CmbIsActive').val(Item.isActive).select2();
                    $('#lblimgPreview').val(Item.offerImagePath);
                    
                } else {
                    swal({
                        title: "Sorry!",
                        text: "No offer data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "No offer data found.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    SaveCollectionData: function () {

        if ($("#validateOffer").valid()) {
            var formData = new FormData();
           
            formData.append("OfferId", $('#txtOfferId').val() || "000000000000");
            formData.append("OfferName", $('#txtOfferName').val());
            formData.append("OfferNameBN", $('#txtNameBN').val());
            formData.append("OfferDescriptions", $('#txtDescription').val());
            formData.append("OfferDescriptionsBN", $('#txtDescriptionBN').val());
            formData.append("StartDate", $('#txtOffeFrom').val());
            formData.append("EndDate", $('#txtOffeTo').val());
            formData.append("OfferType", $('#CmbType').val());
            formData.append("OfferValue", $('#txtOffeValue').val());            
            formData.append("IsActive", $('#CmbIsActive').val());
            formData.append("CreatedBy", $('#hdnUserId').val());
            formData.append("CreatedDate", $('#hdnDateToday').val());
            formData.append("Updatedby", $('#hdnUserId').val());
            formData.append("UpdatedDate", $('#hdnDateToday').val());            
            var fileInput = $('#fileUpload')[0];
            if (fileInput.files.length > 0) {
                formData.append("imageFile", fileInput.files[0]);
            }
            
            $.ajax({
                url: '/Item/CreateOffer', 
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

                        OfferHelper.GetAllIOffers();
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
            formData.append("OfferName", $('#txtOfferName').val());
            formData.append("OfferNameBN", $('#txtNameBN').val());
            formData.append("OfferDescriptions", $('#txtDescription').val());
            formData.append("OfferDescriptionsBN", $('#txtDescriptionBN').val());
            formData.append("StartDate", $('#txtOffeFrom').val());
            formData.append("EndDate", $('#txtOffeTo').val());
            formData.append("OfferType", $('#CmbType').val());
            formData.append("OfferValue", $('#txtOffeValue').val());
            formData.append("IsActive", $('#CmbIsActive').val());
            formData.append("CreatedBy", $('#hdnUserId').val());
            formData.append("CreatedDate", $('#hdnDateToday').val());
            formData.append("Updatedby", $('#hdnUserId').val());
            formData.append("UpdatedDate", $('#hdnDateToday').val());
            formData.append("PreImagePath", $('#lblimgPreview').val());
            var fileInput = $('#fileUpload')[0];
            if (fileInput.files.length > 0) {
                formData.append("imageFile", fileInput.files[0]);
            }
           
            $.ajax({
                url: '/Item/UpdateOfferById',
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
                txtOfferName: "required",
                txtDescription: "required",                
                txtNameBN: "required",
                txtDescriptionBN: "required",                
                txtOffeFrom: "required",                
                txtOffeTo: "required",                
                fileUpload: "required",                
                CmbType: {
                    required: true,
                    notZero: "" 
                },                                
                CmbIsActive: "required"
            },
            messages: {
                txtOfferName: "Offer Name is required",
                txtDescription: "Offer Description is required",                
                txtOffeFrom: "From date is required",                
                txtOffeTo: "To date is required",                
                fileUpload: "File is  required",                
                txtNameBN: "নাম প্রয়োজন",
                txtDescriptionBN: "বর্ণনা প্রয়োজন",                 
                CmbIsActive: "Please select the active status"
            },
            errorPlacement: function (label, element) {
                label.addClass('error');
                element.parent().append(label);
            }
        });
    },
    CreateDetailsObject: function () {
        var table = $('#tblOfferItems').DataTable();
        var detaildata = table.data();
        var datalist = [];
        for (var i = 0; i < detaildata.length; i++) {
            var obj = new Object();            
            obj.OfferItemId = table.cell(i, 3).data();
            obj.OfferId = $("#btnAddTolIst").val();
            obj.MinimumQty = "0";
            obj.MaximumQty = "0";            
            if (table.cell(i, 1).nodes().to$().find('input:checked').val() === "on")
            {
                datalist.push(obj);
            }
            
        }
        return datalist;
    },
    SaveOfferItems: function () {
        const OfferItems = OfferHelper.CreateDetailsObject();
        if (OfferItems.length == 0) {
            swal({
                title: "Sorry!",
                text: "No Items Found!",
                type: "error",
                closeOnConfirm: false,
            });
            return;
        }
        $.ajax({
            url: '/Item/SaveOfferItems',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(OfferItems),
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
                    $("#modal-AddItem").modal("hide");
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
                console.error('Error saving order:', error);
                alert('An error occurred while saving the items.');
            }
        });
    },
    GetDetailsByOfferID: function (OfferId) {        
        var jsonParam = { OfferId: OfferId };
        var serviceUrl = "/Item/GetItemsByOfferId";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (result) {
                if (result.success) {
                    var Item = result.data;
                    $('#mdlTitle').html("Offer Name: " + Item.offerName + ", Offer Id: " +Item.offerId);
                    $('#MdlOfferName').html("Offer Name: "+Item.offerName);
                    $('#MdlOfferNameBN').html("অফার নাম: "+Item.offerNameBN);
                    $('#MdlDescription').html("Description: " + Item.offerDescriptions);
                    $('#MdlDescriptionBN').html("বর্ণনা: " + Item.offerDescriptionsBN);
                    $('#MdlOffeFrom').html("Offe From: " + Item.startDate);
                    $('#MdlOffeTo').html("Offe To: " + Item.endDate);
                    $('#MdlCmbType').html("Type: " + (Item.offerType == "P" ? 'Percentage' : 'Fixed'));
                    $('#MdlOffeValue').html("Offe Value: " + Item.offerValue);

                    OfferHelper.BuildDiscountTbl(result.data1);
                    $("#modal-default").modal("show");
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
};