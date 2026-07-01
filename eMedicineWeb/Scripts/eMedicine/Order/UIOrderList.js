
let cart = [];
let products = [];
let hdnrowId = "";
$(document).ready(function () {
    $(".select2").select2();
    OrderListHelper.BuildTbl("");
    OrderListHelper.BuildTblDetails("");
    OrderListHelper.GetAllOrders();
    $('#ItemSearch').on('keyup', function () {
        const query = $(this).val().trim();

        if (query.length > 0) {
            $.ajax({
                url: '/Order/GetItems',
                method: 'GET',
                data: { item: query },
                dataType: 'json',
                success: function (response) {
                    $('#searchResults').empty();
                    if (response.data.length > 0) {
                        const select = $('#searchResults');
                        select.append('<option value="" disabled selected>Select an item</option>');

                        response.data.forEach(function (item) {
                            if (item.ItemName.length == 1) {
                                select.append('<option value="' + item.ItemId + '">' + item.ItemName + '</option>');
                            } else {
                                select.append('<option value="' + item.ItemId + '">' + item.ItemName + '</option>');
                            }
                        });
                    } else {
                        $('#searchResults').html('<option value="" disabled>No results found</option>');
                    }
                },
                error: function () {
                    console.error('Search failed.');
                }
            });
        } else {
            $('#searchResults').empty();
        }
    });

});
$("#tblOrderDtails").on("click", "#btnDelete", function () {

    var table = $("#tblOrderDtails").DataTable();
    table
        .row($(this).parents('tr'))
        .remove()
        .draw();
    OrderListHelper.BuildTblDetails("");

});
$("#btnConfirm").click(function () {
    OrderListHelper.saveOrderList()
});
$("#btnAddNew").click(function () {
    $("#modal-AddItem").modal("show");
});
$("#searchResults").change(function () {  
    if ($("#searchResults").val() != "") {
        OrderListHelper.GenerateCombo($("#cmbItemUnit"), "SP_SelectGetAllDropDown", "GETALLUNITWITHPRICE", $("#searchResults").val(), "0", "0", "0", "0");
    }

});

$("#btnAddTolIst").click(function () {
    if ($("#searchResults").val() === null || $("#searchResults").val() === "") {
        swal({
            title: "Sorry!",
            text: "Please Select Item !",
            type: "error",
            closeOnConfirm: false
        });
        return;
    }
    if ($("#cmbItemUnit").val() === null || $("#cmbItemUnit").val() === "") {
        swal({
            title: "Sorry!",
            text: "Please Select Item Unit !",
            type: "error",
            closeOnConfirm: false
        });
        return;
    }
    if ($("#txtQty").val() === null || $("#txtQty").val() === "0") {
        swal({
            title: "Sorry!",
            text: "Please Entry Qty !",
            type: "error",
            closeOnConfirm: false
        });
        return;
    }
    if ($("#txtPrice").val() === null || $("#txtPrice").val() === "0") {
        swal({
            title: "Sorry!",
            text: "Please Entry Price !",
            type: "error",
            closeOnConfirm: false
        });
        return;
    }
    OrderListHelper.SaveOrderItem()
});

var OrderListHelper = {
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
        $('#tblOrders').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },
                { data: 'OrderId' },
                { data: 'OrderDate' },
                { data: 'CustomerName' },
                { data: 'CustomerPhone' },
                { data: 'OrderBy' },
                { data: 'SalesPersonName' },
                { data: 'IsDelivered' },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return '<button id="btnDetails" name="btnDetails" type="button" title="Details" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OrderListHelper.GetDetailsByOrderID(\'' + row.OrderId + '\',' + meta.row + ')" class="btn btn-sm btn-warning"> <i class="fa fa-eye" style="font-size:15px; padding:0px;"></i></button>' +
                            '&nbsp;&nbsp;<button id="btnConfirmed" name="btnConfirmed" type="button" title="Confirmd" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OrderListHelper.ChangeStatusByOrderID(\'' + row.OrderId + '\',' + meta.row + ', \'D\')"> <i style="font-size:15px; padding:0px; color: green" class="fa fa-check"></i></button>' +
                            '&nbsp;&nbsp;<button id="btnReject" name="btnReject" type="button" title="Reject" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OrderListHelper.ChangeStatusByOrderID(\'' + row.OrderId + '\',' + meta.row + ', \'R\')" > <i class="fa fa-close" style="font-size:15px;color:red;padding:0px;"></i></button>' +
                            '&nbsp;&nbsp;<button id="btnPrint" name="btnReject" type="button" title="Print" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OrderListHelper.PrintByID(\'' + row.OrderId + '\',' + meta.row + ', \'P\')" > <i class="fa fa-print" style="font-size:15px;color:Green;padding:0px;"></i></button>';

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
                { "targets": [], "visible": false, "searchable": false },

            ]
        });
    },
    BuildTblDetails: function (tbldata) {
        $('#tblOrderDtails').DataTable({
            "footerCallback": function (row, data, start, end, display) {
                var api = this.api(), data;

                // Remove the formatting to get integer data for summation
                var floatval = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                // Total over all pages
                var total = api
                    .column(6)
                    .data()
                    .reduce(function (a, b) {
                        return floatval(a) + floatval(b);
                    }, 0);

                total = total.toFixed(2);

                // Update footer
                $(api.column(6).footer()).html(
                    +total
                );
            },
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },
                { data: 'OrderId' },
                { data: 'ItemId' },
                { data: 'Name' },
                { data: 'UnitPrice' },
                { data: 'Quantity' },
                { data: 'Total' },
                { data: 'RowId' },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return '<button type="button" title="Add" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OrderListHelper.Add(' + meta.row + ')"> ' +
                            '<i style="font-size:15px; padding:0px; color: green" class="fa fa-plus"></i></button>' +
                            '<button type="button" title="Remove" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OrderListHelper.Remove(' + meta.row + ')"> ' +
                            '<i class="fa fa-minus" style="font-size:15px; padding:0px;"></i></button>' +
                            '<button type="button" id="btnDelete" title="Remove" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OrderListHelper.Delete(' + meta.row + ')"> ' +
                            '<i class="fa fa-trash-o" style="font-size:15px;padding:0px;color:red"></i></button>';
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
                { "targets": [], "visible": false, "searchable": false },
            ]
        });
    },
    GetAllOrders: function () {
        var serviceUrl = "/Order/GetAllOrders";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result) {
                if (result.success) {
                    OrderListHelper.BuildTbl(result.data);
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving Orders.!" + result.message,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "Error retrieving Orders.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    GetDetailsByOrderID: function (OrderId, rowId) {
        hdnrowId = rowId
        var table = $("#tblOrders").DataTable();
        $("#mdlTitle").html('Order Id:' + table.cell(rowId, 1).data() + ', Customer Name: ' + table.cell(rowId, 3).data());
        var jsonParam = { OrderId: OrderId };
        var serviceUrl = "/Order/GetDetailsByOrderID";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (result) {
                if (result.success) {
                    OrderListHelper.BuildTblDetails(result.data);
                    $("#modal-default").modal("show");
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving Orders.!" + result.message,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "Error retrieving Orders.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    Add: function (rowId) {
        var table = $("#tblOrderDtails").DataTable();
        var rate = parseFloat(table.cell(rowId, 4).data());
        var qty = parseFloat(table.cell(rowId, 5).data());
        table.cell(rowId, 5).data(qty + 1).draw();
        table.cell(rowId, 6).data(parseFloat(rate * parseFloat(table.cell(rowId, 5).data()).toFixed(2))).draw();
    },
    Remove: function (rowId) {
        var table = $("#tblOrderDtails").DataTable();
        var rate = parseFloat(table.cell(rowId, 4).data());
        var qty = parseFloat(table.cell(rowId, 5).data());
        if (qty > 1) {
            table.cell(rowId, 5).data(qty - 1).draw();
            table.cell(rowId, 6).data(rate * parseFloat(table.cell(rowId, 5).data()).toFixed(2)).draw();
        }
        else {
            swal({
                title: "Sorry!",
                text: "Qty must be greater than zero",
                type: "error",
                closeOnConfirm: false,
                //timer: 2000
            });
            return;
        }

    },
    CreateDetailsObject: function () {
        var table = $('#tblOrderDtails').DataTable();
        var detaildata = table.data();
        var datalist = [];
        for (var i = 0; i < detaildata.length; i++) {
            var obj = new Object();
            obj.OrderId = table.cell(i, 1).data();
            obj.ItemId = table.cell(i, 2).data();
            obj.Name = table.cell(i, 2).data();
            obj.UnitPrice = table.cell(i, 4).data();
            obj.Quantity = table.cell(i, 5).data();
            obj.OrderdBy = $('#hdnUserId').val();
            obj.OrderdDate = $('#hdnDateToday').val();
            datalist.push(obj);
        }
        return datalist;
    },
    saveOrderList: function () {
        const OrderItems = OrderListHelper.CreateDetailsObject();
        if (OrderItems.length == 0) {
            swal({
                title: "Sorry!",
                text: "No Items Found!",
                type: "error",
                closeOnConfirm: false,
            });
            return;
        }
        $.ajax({
            url: '/Order/ConfirmOrders',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(OrderItems),
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
                alert('An error occurred while saving the order.');
            }
        });
    },
    SaveOrderItem: function () {
        var table = $("#tblOrders").DataTable();
        var ItemData = {
            OrderId: table.cell(hdnrowId, 1).data(),
            ItemId: $('#searchResults').val(),
            ShopId: "0",
            Name: $('#searchResults').val(),
            UnitPrice: $('#txtPrice').val(),
            UnitPriceId: $('#cmbItemUnit').val(),
            Quantity: $('#txtQty').val(),
            OrderdBy: $('#hdnUserId').val(),
            OrderdDate: $('#hdnDateToday').val()
        }
        $.ajax({
            url: '/Order/SaveOrdersByShop',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(ItemData),
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
                    //location.reload();
                    $('#searchResults').empty();
                    $('#cmbItemUnit').empty();
                    $('#txtQty').val("");
                    $('#ItemSearch').val("");
                    $('#txtPrice').val("");                    
                    OrderListHelper.GetDetailsByOrderID(table.cell(hdnrowId, 1).data(), hdnrowId)
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Saved Failde!",
                        type: "error",
                        closeOnConfirm: false,
                    });
                }

            },
            error: function (xhr, status, error) {
                // Handle errors
                swal({
                    title: "Sorry!",
                    text: "Error retrieving Generics.!" + error,
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    ChangeStatusByOrderID: function (OrderId, rowId, statusType) {
        var jsonParam = { OrderId: OrderId, statusType: statusType };
        var serviceUrl = "/Order/ChangeStatusByOrderID";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                //console.log(response)
                if (response) {
                    swal({
                        title: "Congratulations",
                        text: "Saved successfully!",
                        type: "success",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        timer: 2000
                    });
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving !" + response.message,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "Error retrieving Orders.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });

    },
    PrintByID: function (OrderId, rowId, statusType) {
        var obj = new Object();

        obj.COMC1 = "",
            obj.DESC1 = OrderId,
            obj.DESC2 = statusType,
            obj.PROCNAME = "sp_SelectOrder",
            obj.CALLTYPE = "ORDERINVOICEBYORDERID",
            obj.RptFileName = "RptOrderMemo.rdlc",
            obj.DataSetName = "dsOrderMaster",
            obj.DataSetName02 = "dsOrderDetails",
            obj.DataSetName03 = "",
            obj.DataSetName04 = "",
            obj.DataSetName05 = "",
            obj.RptFolder = "";


        var objDetails = JSON.stringify(obj);
        var jsonParam = "objReportParameter:" + objDetails;
        var serviceUrl = "/Report/PrintReportData";
        jQuery.ajax({
            url: serviceUrl,
            async: false,
            type: "POST",
            data: "{" + jsonParam + "}",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.success) {
                    var cmbViewType = "PDF";
                    window.open('../Reports/ReportViewerRDLCDS05.aspx?exp=' + cmbViewType, '_blank');
                } else {
                    swal({
                        title: "Sorry!",
                        text: "No Data Found!",
                        type: "info",
                        closeOnConfirm: false
                    });
                }
            }
        });
    }
};


