$(function () {
    $(".select2").select2();
    $(document).ready(function () {
        ActionPlanHelper.BuildtblResportPerList();
        ActionPlanHelper.GenerateCombo($("#cmbUser"), "SP_SELECT_DROPDOWN", "GETEMPLOYEE", "", "", "", "", "");
    });
    $("#btnNew").click(function () {
        location.reload();
    });
    $("#cmbUser").change(function () {
        if ($("#cmbUser").val() == "") {
            $("#DivTable").attr("hidden", true);
            return;
        }
        ActionPlanHelper.GetResponsiblePerson();

    });
    $("#cmbProject").change(function () {
        ActionPlanHelper.GetResponsiblePerson();
    });
    $("#cmbCategory").change(function () {
        ActionPlanHelper.GetResponsiblePerson();
    });
    $("#cmbSubCategory").change(function () {
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
                    '<option value="">' + '-Select-' + '</option>' + data.map(function (item) {
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
            DESC1: $("#cmbUser")[0].value,
            DESC2: $("#cmbProject")[0].value,
            DESC3: $("#cmbCategory")[0].value,
            DESC4: $("#cmbSubCategory")[0].value,
        };
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    $.ajax({
                        url: ApiLink.GetProjPersonReport,
                        type: "GET",
                        contentType: 'application/json',
                        data: obj,
                        success: function (data) {
                            if (data.success) {
                                if (data.data.ds.table.length>0) {
                                    $("#DivTable").attr("hidden", false);
                                    var ds = data.data.ds;
                                    ActionPlanHelper.BuildtblResportPerList(ds.table);
                                    let cmbProject =
                                        '<option value="">' + '-All-' + '</option>' + ds.table1.map(function (item) {
                                            return '<option value="' + item.id + '">' + item.name + '</option>';
                                        }).join('');
                                    $("#cmbProject").html(cmbProject);
                                    let cmbCategory =
                                        '<option value="">' + '-All-' + '</option>' + ds.table2.map(function (item) {
                                            return '<option value="' + item.id + '">' + item.name + '</option>';
                                        }).join('');
                                    $("#cmbCategory").html(cmbCategory);

                                    let cmbSubCategory =
                                        '<option value="">' + '-All-' + '</option>' + ds.table3.map(function (item) {
                                            return '<option value="' + item.id + '">' + item.name + '</option>';
                                        }).join('');
                                    $("#cmbSubCategory").html(cmbSubCategory);
                                }
                                else {
                                    swal({
                                        title: "Sorry!",
                                        text: "",
                                        type: "error",
                                        closeOnConfirm: false,
                                    });
                                    $("#DivTable").attr("hidden", false);
                                }
                            }
                            else {
                                swal({
                                    title: "Sorry!",
                                    text: data.message,
                                    type: "error",
                                    closeOnConfirm: false,
                                });
                                $("#DivTable").attr("hidden", true);
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
    BuildtblResportPerList: function (tbldata) {
        $('#tblResportPerList').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            "order": false,
            "info": false,
            "lengthChange": false,
            "columns": [
                { "data": "project" },
                { "data": "catSubcatName" },
                { "data": "coulmnRowName" },
                { "data": "missedTime" },
                { "data": "countMail" },
                { "data": "sendDate" },
                { "data": "comcId" },
                { "data": "subCategoryId" },
                { "data": "categoryId" },
                { "data": "mapCoulmnId" },
                { "data": "mapRowId" },
                { "data": "refMapRowId" },
            ],
            "columnDefs": [
                {
                    "targets": [3,4,5],
                    "width": "10%",
                },
                {
                    "targets": [6,7,8,9,10,11],
                    "visible": false
                },
                {
                    "targets": [3],
                    "render": function (data, type, row, meta) {
                        return '<button type="button" style="color:blue;border:none;background-color:inherit;font-size:10px;font-weight:bold;" title="Work History" onclick="ActionPlanHelper.GetDetailsByCellId(\'' + row.categoryId + '\',\'' + row.subCategoryId + '\',\'' + row.mapCoulmnId + '\',\'' + row.mapRowId + '\',\'' + row.refMapRowId + '\',\'History\'\)">' + data + '</button>';
                    }
                },
                {
                    "targets": [4],
                    "render": function (data, type, row, meta) {
                        return '<button type="button" style="color:blue;border:none;background-color:inherit;font-size:10px;font-weight:bold;" title="Work History" onclick="ActionPlanHelper.GetDetailsByCellId(\'' + row.categoryId + '\',\'' + row.subCategoryId + '\',\'' + row.mapCoulmnId + '\',\'' + row.mapRowId + '\',\'' + row.refMapRowId + '\',\'MailHistory\'\)">' + data + '</button>';
                    }
                },
            ]
        });
        $('#tblResportPerList').find('th,tr, td').css('border', '1px solid black');
        $('#tblResportPerList').css('border-collapse', 'collapse');
    },

    GetDetailsByCellId: function (categoryId, subcategoryId, MapcoulmnId, MaprowId, RefMapRowId, ModalFor) {
        var obj = {
            DESC1: categoryId,
            DESC2: subcategoryId,
            DESC3: MapcoulmnId,
            DESC4: MaprowId,
            DESC5: RefMapRowId,
            DESC10: $("#cmbUser")[0].value,
        };
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    $.ajax({
                        url: ApiLink.GetDetailsByCellId,
                        type: "GET",
                        data: obj,
                        dataType: "json",
                        success: function (data) {
                            if (data.success) {
                                var ds = data.data.ds;
                                if (ModalFor == "History") {
                                    //Execution Plan Section
                                    var containerExecution = document.getElementById('divExecution');
                                    containerExecution.innerHTML = '';
                                    ds.table1.forEach(function (row, index) {
                                        var divExecution = document.createElement('div');
                                        divExecution.className = 'item-box';
                                        divExecution.setAttribute('data-id', row.rowId);
                                        divExecution.innerHTML =
                                            '<b style ="color:Green; font-size:15px" >' + row.startDate + ' → ' + row.endDate + '</b>' + ' <b class="pull-right">' + row.rowDate + '</b> <br>' +
                                            'Description: ' + row.workDescription + '<br>' +
                                            'Decision: ' + row.meetingDecision + '<br>' +
                                            'Work Status: ' + row.workStatus;

                                        divExecution.addEventListener('click', function () {
                                            $('.item-box').css('background-color', '');
                                            var id = this.getAttribute('data-id');
                                            $(this).css('background-color', '#D3D3D3');
                                        });

                                        containerExecution.appendChild(divExecution);
                                    });
                                    $("#lblHistory").html("View History");
                                    $("#modal-History").modal("show");
                                }
                                if (ModalFor == "MailHistory") {
                                    var containerExecution = document.getElementById('divExecution');
                                    containerExecution.innerHTML = '';
                                    ds.table5.forEach(function (row, index) {
                                        var divExecution = document.createElement('div');
                                        divExecution.className = 'item-box';
                                        divExecution.setAttribute('data-id', row.rowId);
                                        divExecution.innerHTML = '<b style ="color:Green; font-size:15px" >Mailed Time: ' + row.sendDateTime + '</b>' + ' <b class="pull-right"> Mail Count: ' + row.mailNo + '</b> <br>';
                                        containerExecution.appendChild(divExecution);
                                    });
                                    $("#lblHistory").html("View Mailed Date");
                                    $("#modal-History").modal("show");
                                }
                            }
                            else {
                                swal({
                                    title: "Sorry!",
                                    text: data.message,
                                    type: "error",
                                    closeOnConfirm: false,
                                });
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
};