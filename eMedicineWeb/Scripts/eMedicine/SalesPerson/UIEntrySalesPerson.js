let rowId = "";
$(document).ready(function () {
    alert();
    $(".select2").select2();

    jQuery.ajax({
        url: "/Common/GetCurrentDate",
        type: "POST",
        success: function (result) {
            $("#hdnDateToday").datepicker({ format: "dd-M-yyyy", autoclose: true });
            $("#hdnDateToday").datepicker('setDate', new Date(result));            
        }
    });

    SalesPersonHelper.GenerateCombo($("#cmbCompanyId"), "SP_SelectGetAllDropDown", "GETALLCOMPANY", "1", "2", "3", "4", "5");
    SalesPersonHelper.BuildTbl("");
});
$("#btnSave").click(function (event) {
    event.preventDefault();
        SalesPersonHelper.SaveCollectionData();
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
    BuildTbl: function (tbldata) {
        $('#tblCompany').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
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
                { "className": "dt-center", "targets": [] },
                { "className": "dt-left", "targets": [] },

            ]

        });

    },
    SaveCollectionData: function () {

        var companyData = {
            SalesPersonId: $('#txtSalesPersonId').val(),
            SalesPersonName: $('#txtSalesPersonName').val(),
            SalesPersonDescription: $('#txtDescription').val(),
            SalesPersonPhone: $('#txtPhone').val(),
            CompanyId: $('#cmbCompanyId').val(),
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
            },
            error: function (xhr, status, error) {
                // Handle errors
                alert('Error saving company: ' + error);
            }
        });
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
                SalesPersonHelper.BuildAssetTbl(data.Table);
            },
        });
    },   
    GetItemByID: function (masterID) {
        $('#txtItemModel, #txtItemBrand, #txtItemDesc, #txtItemSN, #txtItemVendor, #txtItemPurchaseDate, #txtItemMasterID, #txtItemDetailsID, #txtPONumber, #txtItemWarranty').val('');
        $('#cmbItemStatus').val('0').select2();

        SalesPersonHelper.GenerateCombo($("#cmbSubcode"), "000", "SP_SELECT_ITASSET", "GETSUBCODE", "", "", "", "", "");
        $('#txtItemMasterID').val(masterID);
        var obj = {
            COMC1: "000",
            DESC1: masterID
        };
        var jsonParam = { Param: obj };
        var serviceUrl = "/Common/GetItemDetailsByMasterID";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (data) {
                SalesPersonHelper.InitItemDetailsTbl(data.data02);

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
    }
};