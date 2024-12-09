
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

$("#btnConfirm").click(function () {
    OrderListHelper.saveOrderList()
});

$("#btnAddNew").click(function () {
    OrderListHelper.SaveOrderItem()
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
                    render: function (data, type, row, meta) {
                        return '<button id="btnDetails" name="btnDetails" type="button" title="Details" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OrderListHelper.GetDetailsByOrderID(\'' + row.OrderId + '\',' + meta.row + ')" class="btn btn-sm btn-warning"> <i class="fa fa-eye" style="font-size:15px; padding:0px;"></i></button>' +
                            '<button id="btnConfirmed" name="btnConfirmed" type="button" title="Confirmd" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OrderListHelper.ConfirmedByOrderID(\'' + row.OrderId + '\',' + meta.row + ')"> <i style="font-size:15px; padding:0px; color: green" class="fa fa-check"></i></button>' +                            
                            '<button id="btnReject" name="btnReject" type="button" title="Reject" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="OrderListHelper.GetDetailsByOrderID(\'' + row.OrderId + '\',' + meta.row + ')" > <i class="fa fa-close" style="font-size:15px;color:red;padding:0px;"></i></button>';
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
        var table = $("#tblOrders").DataTable();
        $("#mdlTitle").html('Order Id:'+table.cell(rowId, 1).data() + ', Customer Name: ' + table.cell(rowId, 3).data());
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
            var GenericsData = {
                GenericsId: $('#txtGenericsId').val() ? "" : "000000000000",
                GenericsName: $('#txtName').val(),
                GenericsNameBN: $('#txtNameBN').val(),
                GenericsDescription: $('#txtDescription').val(),
                GenericsDescriptionBN: $('#txtDescriptionBN').val(),
                Indications: $('#txtIndications').val(),
                IndicationsBN: $('#txtIndicationsBN').val(),
                Contraindications: $('#txtContraindications').val(),
                ContraindicationsBN: $('#txtContraindicationsBN').val(),
                TherapeuticClass: $('#txtTherapeuticClass').val(),
                TherapeuticClassBN: $('#txtTherapeuticClassBN').val(),
                SideEffects: $('#txtSideEffects').val(),
                SideEffectsBN: $('#txtSideEffectsBN').val(),
                Precautions: $('#txtPrecautions').val(),
                PrecautionsBN: $('#txtPrecautionsBN').val(),
                Interactions: $('#txtInteractions').val(),
                InteractionsBN: $('#txtInteractionsBN').val(),
                IsActive: $('#CmbIsActive').val(),
                CreatedBy: $('#hdnUserId').val(),
                CreatedDate: $('#hdnDateToday').val(),
                UpdatedBy: $('#hdnUserId').val(),
                UpdatedDate: $('#hdnDateToday').val()
            }
            $.ajax({
                url: '/Order/SaveOrderItem', // Your controller action
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(GenericsData), // Send as JSON
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

                        GenericsHelper.GetAllGenerics()
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
                        text: "Error retrieving Generics.!" + error,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            });        
    },
};


