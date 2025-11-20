$(function () {
    $(".select2").select2();
    $(document).ready(function () {
        ActionPlanHelper.BuildtblResponPerList();
        ActionPlanHelper.GenerateCombo($("#cmbProject"), "SP_SELECT_DROPDOWN", "GETPROJECTLIST", "", "", "", "", "");
    });
    $("#btnNew").click(function () {
        location.reload();
    });
    $("#cmbProject").change(function () {
        if ($("#cmbProject").val() == "") {
            $("#DivTable").attr("hidden", true);
            $("#DivCategory").attr("hidden", true);
            return;
        }
        ActionPlanHelper.GenerateCombo($("#cmbCategory"), "SP_SELECT_DROPDOWN", "GETACTIONCATAGORY", $("#cmbProject")[0].value, "", "", "", "");
        ActionPlanHelper.GetResponsiblePerson();

    });
    $("#cmbCategory").change(function () {
        ActionPlanHelper.GetResponsiblePerson();
    });
});

var ActionPlanHelper = {
    GenerateCombo: function (objcmb, proName, callName, param1, param2, param3, param4, param5) {
        objcmb.empty();
        var Param = { ProcedureName: proName, CallName: callName, Param1: param1, Param2: param2, Param3: param3, Param4: param4, Param5: param5 };
        $.ajax({
            url: ApiLink.GetComboData,
            type: "GET",
            data: Param,
            dataType: "json",
            success: function (data) {
                let options =
                    '<option value="">' + ((objcmb[0].id == "cmbCategory") ? '-All-' : '-Select-') + '</option>' + data.map(function (item) {
                        return '<option value="' + item.id + '">' + item.name + '</option>';
                    }).join('');
                objcmb.html(options);
            },
            error: function (data) {
                swal({
                    title: "Sorry!",
                    text: "Something Went Wrong !!! \n" + data.details,
                    type: "error",
                    closeOnConfirm: false
                });
            }
        });
    },
    GetResponsiblePerson: function () {
        var obj = {
            DESC1: $("#cmbProject")[0].value,
            DESC2: $("#cmbCategory")[0].value,
        };
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    $.ajax({
                        url: ApiLink.GetResponsiblePersonList,
                        type: "GET",
                        contentType: 'application/json',
                        data: obj,
                        success: function (data) {
                            if (data.success) {
                                var ds = data.data.ds;
                                ActionPlanHelper.BuildtblResponPerList(ds.table);
                                $("#DivTable").attr("hidden", false);
                                $("#DivCategory").attr("hidden", false);
                            }
                            else {
                                swal({
                                    title: "Sorry!",
                                    text: data.message,
                                    type: "error",
                                    closeOnConfirm: false,
                                });
                                $("#DivTable").attr("hidden", true);
                                $("#DivCategory").attr("hidden", true);
                            }
                        },
                        error: function (data) {
                            swal({
                                title: "Sorry!",
                                text: "Something Went Wrong !!! \n" + data.details,
                                type: "error",
                                closeOnConfirm: false
                            });
                        }
                    });
                }
            });
    },
    BuildtblResponPerList: function (tbldata) {
        $('#tblResponPerList').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            "order": false,
            "info": false,
            "lengthChange": false,
            "columns": [
                { "data": "responsiblePersonId" },
                { "data": "responsiblePersonIdView" },
                { "data": "responsiblePersonName" },
                { "data": "responsiblePersonDesig" },
                { "data": "responsiblePersonDept" },
                { "data": "responsiblePersonEmail" },
                { "data": "responsiblePersonContact" },
                { "data": "hodId" },
                { "data": "hodIdView" },
                { "data": "hodName" },
                { "data": "hodDesig" },
                { "data": "hodDept" },
                { "data": "hodEmail" },
                { "data": "hodContact" },
            ],
            "columnDefs": [
                {
                    "targets": [0,4, 7,11],
                    "visible": false
                },
                //{
                //    "targets": [1,2,3,4,6],
                //    "width": "8%",
                //    "createdCell": function (td, cellData, rowData, row, col) {
                //        $(td).css('background-color', '#B8FFCF'); // Light blue
                //    }
                //},
                //{
                //    "targets": [8, 9, 10, 11, 13],
                //    "width": "8%",
                //    "createdCell": function (td, cellData, rowData, row, col) {
                //        $(td).css('background-color', '#FFD3B8'); // Light blue
                //    }

                //},
                //{
                //    "targets": [5],
                //    "width": "10%",
                //    "createdCell": function (td, cellData, rowData, row, col) {
                //        $(td).css('background-color', '#B8FFCF'); // Light blue
                //    }
                //},
                //{
                //    "targets": [12],
                //    "width": "10%",
                //    "createdCell": function (td, cellData, rowData, row, col) {
                //        $(td).css('background-color', '#FFD3B8'); // Light blue
                //    }
                //},
            ]
        });
        $('#tblResponPerList').find('th,tr, td').css('border', '1px solid black');
        $('#tblResponPerList').css('border-collapse', 'collapse');
    },
};