
let cart = [];
let products = [];
let rowId = "";
$(document).ready(function () {

    OrderListHelper.BuildTbl("");
    OrderListHelper.BuildTblDetails("");
    OrderListHelper.GetAllOrders();
});

$("#tblOrderDtails").on("click", "#btnDelete", function () {

    var table = $("#tblOrderDtails").DataTable();
    table
        .row($(this).parents('tr'))
        .remove()
        .draw();
    OrderListHelper.BuildTblDetails("");

});

var OrderListHelper = {
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
                    render: function (data, type, row) {
                        return '<button id="btnConfirmed" name="btnConfirmed" type="button" title="Confirmd" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OrderListHelper.ConfirmedByOrderID(\'' + row.OrderId + '\')"> <i style="font-size:15px; padding:0px; color: green" class="fa fa-check"></i></button><button id="btnDetails" name="btnDetails" type="button" title="Details" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OrderListHelper.GetDetailsByOrderID(\'' + row.OrderId + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-eye" style="font-size:15px; padding:0px;"></i></button>';
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
    GetDetailsByOrderID: function (OrderId) {

        var jsonParam = { OrderId: OrderId };
        var serviceUrl = "/Order/GetDetailsByOrderID";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (result) {
                if (result.success) {
                    //console.log(result.data);
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
        
    }
};


