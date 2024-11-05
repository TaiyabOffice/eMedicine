let rowId = "";
$(document).ready(function () {
    $(".select2").select2();

    jQuery.ajax({
        url: "/Common/GetCurrentDate",
        type: "POST",
        success: function (result) {
            $("#CreatedDate").datepicker({ format: "dd-M-yyyy", autoclose: true });
            $("#CreatedDate").datepicker('setDate', new Date(result));

            $("#DeletedDate").datepicker({ format: "dd-M-yyyy", autoclose: true });
            $("#DeletedDate").datepicker('setDate', new Date(result));
        }
    });

    //UICompanyHelper.GenerateCombo($("#cmbItemCategory"), "000", "SP_SELECT_ITASSET", "GETCATEGORIESFORITASSET", "", "", "", "", "");
    UICompanyHelper.BuildAssetTbl("");
});


$("#btnSave").click(function (event) {
    event.preventDefault();

        UICompanyHelper.SaveCollectionData();
    //else {
    //    swal({
    //        title: 'Sorry!',
    //        text: 'Invalid Data for Save',
    //        type: "error",
    //        icon: 'error',
    //        closeOnConfirm: false

    //    });
    //}
});

$("#btnClear").click(function (event) {
    event.preventDefault();
    location.reload();
});

var UICompanyHelper = {
    SaveCollectionData: function () {

        var companyData = {
            CompanyId: $('#CompanyId').val(),
            CompanyName: $('#CompanyName').val(),
            CompanyAddress: $('#CompanyAddress').val(),
            CompanyDescription: $('#CompanyDescription').val(),
            CompanyPhone: $('#CompanyPhone').val(),
            CompanyCity: $('#CompanyCity').val(),
            CompanyRegion: $('#CompanyRegion').val(),
            CompanyPostalCode: $('#CompanyPostalCode').val(),
            CompanyCountry: $('#CompanyCountry').val(),
            IsActive: $('#IsActive').val(),
            CreatedBy: $('#CreatedBy').val(),
            CreatedDate: $('#CreatedDate').val(),
            UpdatedBy: $('#UpdatedBy').val(),
            DeletedBy: $('#DeletedBy').val(),
            DeletedDate: $('#DeletedDate').val()
        };

        // Send the form data to the CreateCompany action via AJAX
        $.ajax({
            url: '/Company/CreateCompany', // Your controller action
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(companyData), // Send as JSON
            success: function (response) {
                // Success message
                alert('Company saved successfully!');
                var serviceUrl = "/Company/GetAllCompany";
                jQuery.ajax({
                    url: serviceUrl,
                    type: "POST",
                    success: function (data) {
                        data = $.parseJSON(data);
                        UICompanyHelper.BuildAssetTbl(data.Table);
                    },
                });
                UICompanyHelper.BuildAssetTbl();


                //// Reload the DataTable to reflect new data
                //companyTable.ajax.reload();

                //// Optionally clear the form after saving
                //$('#validateCompany')[0].reset();
            },
            error: function (xhr, status, error) {
                // Handle errors
                alert('Error saving company: ' + error);
            }
        });



        //if ($("#validate").valid() && $("#cmbItemCategory").val() != "0" && $("#cmbItemStatus").val() != "0") {

        //    var objDetails = JSON.stringify(obj);
        //    var newItemList = JSON.stringify(listitem);
        //    var jsonParam = "objDetails:" + objDetails + ',newItemList:' + newItemList;
        //    console.log(jsonParam);

        //    var serviceUrl = "/UIITAsset/SaveLaptopOrPC";
        //    jQuery.ajax({
        //        url: serviceUrl,
        //        type: "POST",
        //        data: "{" + jsonParam + "}",
        //        dataType: "json",
        //        contentType: "application/json; charset=utf-8",
        //        success: function (data) {
        //            if (data.status) {
        //                $('#txtItemModel, #txtItemBrand, #txtItemDesc, #txtItemSN, #txtItemVendor, #txtItemPurchaseDate, #txtItemMasterID, #txtItemDetailsID, #txtItemMasterID, #txtItemWarranty').val('');
        //                $("#cmbItemStatus").val("0").select2();

        //                if ($.fn.DataTable.isDataTable('#tblItemDetails')) {
        //                    $('#tblItemDetails').DataTable().clear().destroy();
        //                }
        //                UICompanyHelper.InitItemDetailsTbl();

        //                swal({
        //                    title: "Congratulation!!",
        //                    text: "Save Successfully",
        //                    type: "success",
        //                    closeOnConfirm: false,
        //                });
        //                UICompanyHelper.GetAssetByCategory();
        //            } else {
        //                swal({
        //                    title: "Sorry!",
        //                    text: "Failed to save!",
        //                    type: "error",
        //                    closeOnConfirm: false,
        //                });
        //            }
        //        },
        //        error: function (data) {
        //            swal({
        //                title: "Sorry!",
        //                text: "Something Went Wrong !!! \n" + data.statusText,
        //                type: "error",
        //                closeOnConfirm: false
        //            });
        //        }
        //    });
        //} else {
        //    swal({
        //        title: "Sorry!",
        //        text: "Please Fill all the fields!",
        //        type: "error",
        //        closeOnConfirm: false
        //    });
        //}
    },
    damageItemDetails: function (rowIndex) {
        rowId = rowIndex;
        var table = $('#tblItemDetails').DataTable();
        var rowData = table.row(rowIndex).data();

        $('#cmbSubcode').val(rowData.DESC1).trigger("change");
        $('#txtItemDetailsModel').val(rowData.DESC4);
        $('#txtItemDetailsBrand').val(rowData.DESC5);
        $('#txtItemDetailsDsc').val(rowData.DESC6);
        $('#txtItemDetailsSpec').val(rowData.DESC7);
        $('#txtItemDetailsSN').val(rowData.DESC8);
        $('#txtItemDetailsSize').val(rowData.DESC9);
        $('#txtItemDetailsWarranty').val(rowData.DESC10);
        $('#cmbItemDetailsStatus').val(rowData.DESC11).trigger("change");
        $('#txtHdnMasterID').val(rowData.DESC17);
        $('#txtHdnDetailsID').val(rowData.DESC3);
        $('#txtItemDetailsID').val(rowData.DESC3);

        $('#hdnIsDamaged').val(rowData.DESC14);
        $('#txtDmgReason').val(rowData.DESC15);

        $('#modalDamage').modal('show');
    },
    editDataTable: function (rowIndex) {
        rowId = rowIndex;
        var table = $('#tblItemDetails').DataTable();
        var rowData = table.row(rowIndex).data();

        $('#cmbSubcode').val(rowData.DESC1).trigger("change");
        $('#txtItemDetailsModel').val(rowData.DESC4);
        $('#txtItemDetailsBrand').val(rowData.DESC5);
        $('#txtItemDetailsDsc').val(rowData.DESC6);
        $('#txtItemDetailsSpec').val(rowData.DESC7);
        $('#txtItemDetailsSN').val(rowData.DESC8);
        $('#txtItemDetailsSize').val(rowData.DESC9);
        $('#txtItemDetailsWarranty').val(rowData.DESC10);
        $('#cmbItemDetailsStatus').val(rowData.DESC11).trigger("change");
        $('#txtHdnMasterID').val(rowData.DESC17);
        $('#txtHdnDetailsID').val(rowData.DESC3);
        $('#txtItemDetailsID').val(rowData.DESC3);

        $('#modalConfiguration').modal('show');
    },
    GetAssetByCategory: function () {
        var obj = {
            COMC1: "000",
            DESC1: $("#cmbItemCategory option:selected").val()
        };
        var jsonParam = { Param: obj };
        var serviceUrl = "/UIITAsset/GetAssetByCategory";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (data) {
                data = $.parseJSON(data);
                UICompanyHelper.BuildAssetTbl(data.Table);
            },
        });
    },
    BuildAssetTbl: function (tbldata) {
        $('#tblCompany').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                        { data: 'CompanyId' },
                        { data: 'CompanyName' },
                        { data: 'CompanyAddress' },
                        { data: 'CompanyDescription' },
                        { data: 'CompanyPhone' },
                        { data: 'CompanyCity' },
                        { data: 'CompanyCountry' },
                        { data: 'IsActive' },
                        {
                            data: null,
                            render: function (data, type, row) {
                                return '<button class="btn btn-info btn-sm">Edit</button>';
                            }
                        }
            ],
            "columnDefs": [
                {
                    "targets": [0],
                    "width": "2%",
                    render: function (data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1; },
                },
                {
                    "targets": [15],
                    "render": function (data, type, row, meta) {
                        if (row.ACTIVITYSTATUS == "D") {
                            return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="UICompanyHelper.GetItemByID(\'' + row.ITEMMASTERID + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button>';

                        } else if (row.ACTIVITYSTATUS == "M") {
                            return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="UICompanyHelper.GetItemByID(\'' + row.ITEMMASTERID + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button>';

                        } else if (row.ACTIVITYSTATUS == "S") {
                            return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="UICompanyHelper.GetItemByID(\'' + row.ITEMMASTERID + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button>' +
                                '<button id="btnItemDamage" name="btnItemDamage" type="button" title="Damage" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="UICompanyHelper.damageItem(\'' + row.ITEMMASTERID + '\')" class="btn btn-sm btn-danger"> <i class="fa fa-trash" style="font-size:15px; padding:0px;"></i> </button>';

                        } else if (row.ACTIVITYSTATUS == "A") {
                            return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:25px; height:20px; padding:0px;" onclick="UICompanyHelper.GetItemByID(\'' + row.ITEMMASTERID + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button>' +
                                '<button id="btnItemDamage" name="btnItemDamage" type="button" title="Damage" style="margin-right:2px; width:20px; height:25px; padding:0px;" onclick="UICompanyHelper.damageItem(\'' + row.ITEMMASTERID + '\')" class="btn btn-sm btn-danger"> <i class="fa fa-trash" style="font-size:15px; padding:0px;"></i> </button>';

                        } else if (row.ACTIVITYSTATUS == 'N') {
                            return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="UICompanyHelper.GetItemByID(\'' + row.ITEMMASTERID + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button>' +
                                '<button id="btnItemDamage" name="btnItemDamage" type="button" title="Damage" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="UICompanyHelper.damageItem(\'' + row.ITEMMASTERID + '\')" class="btn btn-sm btn-danger"> <i class="fa fa-trash" style="font-size:15px; padding:0px;"></i> </button>' +
                                '<button id="btnAssign" name="btnAssign" type="button" title="Assign Item to Employee" style="margin-right:2px; width:20px; height:20px; padding: 0px;" onclick="UICompanyHelper.AssignItem(\'' + meta.row + '\')" class="btn btn-sm btn-info"> <i class="fa fa-user-plus" aria-hidden="true" style="font-size:15px; padding:0px;"></i> </button>';

                        }
                    }

                },

                {
                    "targets": [13],
                    "render": function (data, type, row, meta) {
                        if (row.ACTIVITYSTATUS == "D") {
                            return 'Damaged';
                        }
                        if (row.ACTIVITYSTATUS == "S") {
                            return 'On Servicing';
                        }
                        if (row.ACTIVITYSTATUS == "M") {
                            return 'Missing';
                        }
                        if (row.ACTIVITYSTATUS == "N") {
                            return 'Nutral';
                        }
                        if (row.ACTIVITYSTATUS == "A") {
                            return 'Assigned';
                        }
                    }
                },

                {
                    "targets": [0, 9, 11, 16, 17],
                    "visible": false,
                    "searchable": false
                },
                { "className": "dt-center", "targets": [0, 1, 5, 8, 9, 10, 11] },
                { "className": "dt-left", "targets": [2, 3, 4, 6, 7] },

            ]

        });

    },
    GetItemByID: function (masterID) {
        $('#txtItemModel, #txtItemBrand, #txtItemDesc, #txtItemSN, #txtItemVendor, #txtItemPurchaseDate, #txtItemMasterID, #txtItemDetailsID, #txtPONumber, #txtItemWarranty').val('');
        $('#cmbItemStatus').val('0').select2();

        UICompanyHelper.GenerateCombo($("#cmbSubcode"), "000", "SP_SELECT_ITASSET", "GETSUBCODE", "", "", "", "", "");
        $('#txtItemMasterID').val(masterID);
        var obj = {
            COMC1: "000",
            DESC1: masterID
        };
        var jsonParam = { Param: obj };
        var serviceUrl = "/UIITAsset/GetItemDetailsByMasterID";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (data) {
                UICompanyHelper.InitItemDetailsTbl(data.data02);

                $('#txtItemMasterID').val(data.data01[0].DESC1);
                $('#txtItemModel').val(data.data01[0].DESC2);
                $('#txtItemBrand').val(data.data01[0].DESC3);
                $('#txtItemDesc').val(data.data01[0].DESC4);
                $('#txtItemSN').val(data.data01[0].DESC5);
                $('#txtItemVendor').val(data.data01[0].DESC6);
                $('#txtPONumber').val(data.data01[0].DESC7);
                $('#txtItemPurchaseDate').val(data.data01[0].DESC8).datepicker({ format: "dd-M-yyyy", autoclose: true });
                $('#cmbItemStatus').val(data.data01[0].DESC9).select2();
                $('#txtInvoiceNO').val(data.data01[0].DESC10);
                $('#txtItemWarranty').val(data.data01[0].DESC11);
                $('#cmbItemCategory').val(data.data01[0].DESC12).select2();
            }
        });
    },
    GenerateCombo: function (objcmb, Com, proName, callName, param1, param2, param3, param4, param5) {
        objcmb.empty();
        var json = { procedureName: proName, com: Com, callName: callName, Param1: param1, Param2: param2, Param3: param3, Param4: param4, Param5: param5 };
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
    },
};

//$(document).ready(function () {
//    // Initialize the DataTable to load existing companies
//    var companyTable = $('#tblCompany').DataTable({
//        ajax: {
//            url: '/Company/GetAllCompany', // Controller action to fetch company data
//            dataSrc: '' // Adjust based on your API response structure
//        },
//        columns: [
//            { data: 'CompanyId' },
//            { data: 'CompanyName' },
//            { data: 'CompanyAddress' },
//            { data: 'CompanyDescription' },
//            { data: 'CompanyPhone' },
//            { data: 'CompanyCity' },
//            { data: 'CompanyCountry' },
//            { data: 'IsActive' },
//            {
//                data: null,
//                render: function (data, type, row) {
//                    return '<button class="btn btn-info btn-sm">Edit</button>';
//                }
//            }
//        ]
//    });

//    // Click event handler for the Save button
//    $('#btnSave').click(function () {
//        // Collect form data
//        var companyData = {
//            CompanyId: $('#CompanyId').val(),
//            CompanyName: $('#CompanyName').val(),
//            CompanyAddress: $('#CompanyAddress').val(),
//            CompanyDescription: $('#CompanyDescription').val(),
//            CompanyPhone: $('#CompanyPhone').val(),
//            CompanyCity: $('#CompanyCity').val(),
//            CompanyRegion: $('#CompanyRegion').val(),
//            CompanyPostalCode: $('#CompanyPostalCode').val(),
//            CompanyCountry: $('#CompanyCountry').val(),
//            IsActive: $('#IsActive').val(),
//            CreatedBy: $('#CreatedBy').val(),
//            CreatedDate: $('#CreatedDate').val(),
//            UpdatedBy: $('#UpdatedBy').val(),
//            DeletedBy: $('#DeletedBy').val(),
//            DeletedDate: $('#DeletedDate').val()
//        };

//        // Send the form data to the CreateCompany action via AJAX
//        $.ajax({
//            url: '/Company/CreateCompany', // Your controller action
//            type: 'POST',
//            contentType: 'application/json',
//            data: JSON.stringify(companyData), // Send as JSON
//            success: function (response) {
//                // Success message
//                alert('Company saved successfully!');

//                // Reload the DataTable to reflect new data
//                companyTable.ajax.reload();

//                // Optionally clear the form after saving
//                $('#validateCompany')[0].reset();
//            },
//            error: function (xhr, status, error) {
//                // Handle errors
//                alert('Error saving company: ' + error);
//            }
//        });
//    });

//    // Clear button functionality to reset the form fields
//    $('#btnClear').click(function () {
//        $('#validateCompany')[0].reset();
//    });
//});
