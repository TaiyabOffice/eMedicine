var rowId = "";

$(function () {
    $(".select2").select2();
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });
    $(document).ready(function () {
        //TemplateSettingHelper.BuildtblSubCatList();
        TemplateSettingHelper.BuildtblColumnList();
        TemplateSettingHelper.BuildtblRowList();
        TemplateSettingHelper.GenerateCombo($("#cmbTemplateType"), "SP_SELECT_DROPDOWN", "GETALLCODEGROUP", "110100060000", "", "", "", "");
        TemplateSettingHelper.GenerateCombo($("#cmbCategory"), "SP_SELECT_DROPDOWN", "GETALLCODEGROUP", "110100010000", "", "", "", "");
        TemplateSettingHelper.GenerateCombo($("#cmbSubCategory"), "SP_SELECT_DROPDOWN", "GETALLCODEGROUP", "110100020000", "", "", "", "");
        TemplateSettingHelper.GenerateCombo($("#cmbColumnGroup"), "SP_SELECT_DROPDOWN", "GETALLCODEGROUP", "110100030000", "", "", "", "");
        TemplateSettingHelper.GenerateCombo($("#cmbResponsiblePerson"), "SP_SELECT_DROPDOWN", "GETEMPLOYEE", "", "", "", "", "");
    });
    $("#btnNew").click(function () {
        location.reload();
    });
    $("#btnSave").click(function () {
        swal({
            title: "Are You Sure ?",
            text: "",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                TemplateSettingHelper.SaveTemplateData();
            });
        });
    });
    $("#btnSaveType").click(function () {
        swal({
            title: "Are You Sure ?",
            text: "",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                TemplateSettingHelper.SaveTypeData();
            });
        });
    });
    $('#chkAllColumn').on('click', function () {
        var isChecked = $(this).prop('checked');
        var tblColumnList = $('#tblColumnList').DataTable();
        tblColumnList.rows()
            .data()
            .toArray()
            .map(function (row, i) {
                tblColumnList.cell(i, 0)
                    .nodes()
                    .to$()
                    .find('input[type="checkbox"]')
                    .prop('checked', isChecked)
            });
    });

    $('#chkAllRow').on('click', function () {
        var isChecked = $(this).prop('checked');
        var tblRowList = $('#tblRowList').DataTable();
        tblRowList.rows()
            .data()
            .toArray()
            .map(function (row, i) {
                tblRowList.cell(i, 0)
                    .nodes()
                    .to$()
                    .find('input[type="checkbox"]')
                    .prop('checked', isChecked)
            });
    });

    $("#cmbTemplateType").change(function () {
        $('#chkAllRow').prop('checked', false);
        $('#chkAllColumn').prop('checked', false);
        if ($("#cmbTemplateType").val() == "" || $("#cmbCategory").val() == "" /*|| $("#cmbSubCategory").val() == ""*/) {
            var table = $('#tblColumnList').DataTable();
            table.clear().draw();
            var table1 = $('#tblRowList').DataTable();
            table1.clear().draw();
        }
        else {
            TemplateSettingHelper.GetTempleteData();
        }
    });
    $("#cmbCategory").change(function () {
        $('#chkAllRow').prop('checked', false);
        $('#chkAllColumn').prop('checked', false);
        if ($("#cmbTemplateType").val() == "" || $("#cmbCategory").val() == "" /*|| $("#cmbSubCategory").val() == ""*/) {
            var table = $('#tblColumnList').DataTable();
            table.clear().draw();
            var table1 = $('#tblRowList').DataTable();
            table1.clear().draw();
        }
        else {
            TemplateSettingHelper.GetTempleteData();
        }
    });
    $("#cmbSubCategory").change(function () {
        $('#chkAllRow').prop('checked', false);
        $('#chkAllColumn').prop('checked', false);
        if ($("#cmbTemplateType").val() == "" || $("#cmbCategory").val() == "" /*|| $("#cmbSubCategory").val() == ""*/) {
            var table = $('#tblColumnList').DataTable();
            table.clear().draw();
            var table1 = $('#tblRowList').DataTable();
            table1.clear().draw();
        }
        else {
            TemplateSettingHelper.GetTempleteData();
        }
    });


    $("#lblAddTemplateType").click(function () {
        $("#hdnTypeID").val("110100060000");
        $("#lblAddType").html("Add Template Type");
        $("#modal-AddType").modal("show");
    });

    $("#lblAddColumnGroup").click(function () {
        $("#modal-AddColumnGroup").modal("hide");
        $("#hdnTypeID").val("110100030000");
        $("#lblAddType").html("Add Column Group");
        $("#modal-AddType").modal("show");
    });

    $("#lblAddCategory").click(function () {
        $("#hdnTypeID").val("110100010000");
        $("#lblAddType").html("Add Category");
        $("#modal-AddType").modal("show");
    });

    $("#lblAddSubCategory").click(function () {
        $("#hdnTypeID").val("110100020000");
        $("#lblAddType").html("Add Sub Category");
        $("#modal-AddType").modal("show");
    });

    $("#lblAddColumn").click(function () {
        $("#hdnTypeID").val("110100040000");
        $("#lblAddType").html("Add Column");
        $("#modal-AddType").modal("show");
    });

    $("#lblAddRow").click(function () {
        $("#hdnTypeID").val("110100050000");
        $("#lblAddType").html("Add Row");
        $("#modal-AddType").modal("show");
    });
    $("#btnUpdateColumnGroup").click(function () {
        TemplateSettingHelper.UpdateColumnGroup();
    });
    $("#btnUpdateResponsiblePerson").click(function () {
        TemplateSettingHelper.UpdateResponsiblePerson();
    });
});

var TemplateSettingHelper = {
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
                    '<option value="">-Select-</option>' + data.map(function (item) {
                        return '<option value="' + item.id + '">' + item.name + '</option>';
                    }).join('');
                objcmb.html(options);
            }
        });
    },
    //BuildtblSubCatList: function (tbldata) {
    //    $('#tblSubCatList').DataTable({
    //        data: tbldata,
    //        "responsive": true,
    //        "bDestroy": true,
    //        "order": false,
    //        "info": false,

    //        "columns": [
    //            { "data": null },
    //            { "data": "subCode" },
    //            { "data": "refSubCode" },
    //            { "data": "groupCode" },
    //            { "data": "subDesc" },
    //            { "data": "isActive" },
    //        ],
    //        "columnDefs": [
    //            {
    //                "targets": [1, 2, 3, 5],
    //                "visible": false
    //            },
    //            {
    //                "targets": [0],
    //                "width": "2%",
    //                "render": function (data, type, row, meta) {
    //                    //if (row.CHK == "Y") {
    //                    //    return '<input type="checkbox" class="coll-checkbox" id="txtCheck" checked>';
    //                    //}
    //                    //else {
    //                    return '<input type="checkbox">';
    //                    //}
    //                }
    //            },
    //        ],
    //    });
    //},

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
        var caratPos = TemplateSettingHelper.getSelectionStart(el);
        var dotPos = el.value.indexOf(".");
        if (caratPos > dotPos && dotPos > -1 && (number[1].length > deci_point - 1)) {
            return false;
        }
        return true;
    },

    BuildtblColumnList: function (tbldata) {
        $('#tblColumnList').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            "order": false,
            "info": false,

            "columns": [
                { "data": null },
                { "data": "chk" },
                { "data": "subCode" },
                { "data": "groupId" },
                { "data": "responsiblePerson" },
                { "data": "subDesc" },
                { "data": "groupName" },
                { "data": "responsiblePerName" },
                { "data": "seqNo" },
                { "data": null },
            ],
            "columnDefs": [
                {
                    "targets": [1, 2, 3,4, 9],
                    "visible": false
                },
                {
                    "targets": [5,6,7],
                    "width": "30%",
                },
                {
                    "targets": [0],
                    "width": "2%",
                    "className": "dt-center",
                    "render": function (data, type, row, meta) {
                        if (row.chk == "Y") {
                            return '<input type="checkbox" class="coll-checkbox" checked>';
                        }
                        else {
                            return '<input type="checkbox" class="coll-checkbox">';
                        }
                    }
                },
                {
                    "targets": [8],
                    "width": "2%",
                    "className": "dt-right",
                    "render": function (data, type, row, meta) {
                        return '<input size="10px" value="' + parseFloat(data).toFixed(2) + '" maxlength="15" style="text-align: right;height=10px!important;" onkeypress="return TemplateSettingHelper.isDeciaml(this, event, 2)">';
                    },
                    "orderable": true,
                    "searchable": false
                },
                {
                    "targets": [6],
                    "width": "2%",
                    "render": function (data, type, row, meta) {
                        return '<button type="button" style="color:blue;font-style:italic;border:none;background-color:inherit;font-size:10px;font-weight:bold;"  onclick="TemplateSettingHelper.GetColumnGroupForUpdate(' + meta.row + ')">' + data + '</button>';
                    }
                },
                {
                    "targets": [7],
                    "width": "2%",
                    "render": function (data, type, row, meta) {
                        return '<button type="button" style="color:blue;tfont-style:italic;border:none;background-color:inherit;font-size:10px;font-weight:bold;"  onclick="TemplateSettingHelper.GetResponsiblePersonForUpdate(' + meta.row + ')">' + data + '</button>';
                    }
                }
            ]
        });
    },

    GetColumnGroupForUpdate: function (rid) {
        rowId = rid;
        var table = $("#tblColumnList").DataTable();
        var groupId = table.cell(rid, 3).data();
        $("#cmbColumnGroup").val(groupId);
        $("#cmbColumnGroup").select2();
        $("#modal-AddColumnGroup").modal("show");
    },
    GetResponsiblePersonForUpdate: function (rid) {
        rowId = rid;
        var table = $("#tblColumnList").DataTable();
        var ResponsiblePersonId = table.cell(rid, 4).data();
        $("#cmbResponsiblePerson").val(ResponsiblePersonId);
        $("#cmbResponsiblePerson").select2();
        $("#modal-AddResponsiblePerson").modal("show");
    },

    UpdateColumnGroup: function () {
        //if ($("#cmbColumnGroup").val() == null || $("#cmbColumnGroup").val()=="") {
        //    swal({
        //        title: "Sorry!",
        //        text: "Please Select Column Group",
        //        type: "warning",
        //        closeOnConfirm: false,
        //    });
        //    return;
        //}
        var table = $("#tblColumnList").DataTable();
        table.cell(rowId, 3).data($("#cmbColumnGroup").val()).draw();
        table.cell(rowId, 6).data($("#cmbColumnGroup").children("option:selected").text()).draw();
        $("#modal-AddColumnGroup").modal("hide");
    },

    UpdateResponsiblePerson: function () {
        //if ($("#cmbResponsiblePerson").val() == null || $("#cmbResponsiblePerson").val() == "") {
        //    swal({
        //        title: "Sorry!",
        //        text: "Please Select Responsible Person",
        //        type: "warning",
        //        closeOnConfirm: false,
        //    });
        //    return;
        //}
        var table = $("#tblColumnList").DataTable();
        table.cell(rowId, 4).data($("#cmbResponsiblePerson").val()).draw();
        table.cell(rowId, 7).data($("#cmbResponsiblePerson").children("option:selected").text()).draw();
        $("#modal-AddResponsiblePerson").modal("hide");
    },

    BuildtblRowList: function (tbldata) {
        $('#tblRowList').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            "order": false,
            "info": false,

            "columns": [
                { "data": null },
                { "data": "chk" },
                { "data": "subCode" },
                { "data": "groupId" },
                { "data": "subDesc" },
                { "data": "groupName" },
                { "data": "seqNo" },
                { "data": null },
            ],
            "columnDefs": [
                {
                    "targets": [1, 2, 3, 5, 7],
                    "visible": false
                },
                {
                    "targets": [0],
                    "width": "2%",
                    "class": "dt-center",
                    "render": function (data, type, row, meta) {
                        if (row.chk == "Y") {
                            return '<input type="checkbox" class="coll-checkbox" checked>';
                        }
                        else {
                            return '<input type="checkbox" class="coll-checkbox">';
                        }
                    }
                },
                {
                    "targets": [6],
                    "width": "2%",
                    "className": "dt-right",
                    "render": function (data, type, row, meta) {
                        return '<input size="10px" value="' + parseFloat(data).toFixed(2) + '" maxlength="15" style="text-align: right;height=10px!important;" onkeypress="return TemplateSettingHelper.isDeciaml(this, event, 2)">';
                    },              
                    "orderable": true,
                    "searchable": false
                },
                {
                    "targets": [7],
                    "width": "2%",
                    "class": "dt-center",
                    "render": function (data, type, row, meta) {
                        return '';
                        //'<button type="button" style="color:blue;text-decoration:underline;font-style:italic;border:none;background-color:inherit;font-size:12px;font-weight:bold;"  onclick="SupplierBillHelper.GetViewBillDetailByID(' + meta.row + ')"><i class="fa fa-pencil"></i></button>';
                    }
                }
            ]
        });
    },

    GetTempleteData: function () {
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    var obj = {
                        DESC1: $("#cmbTemplateType").val(),
                        DESC2: $("#cmbCategory").val(),
                        DESC3: $("#cmbSubCategory").val() == "" ? "000000000000" : $("#cmbSubCategory").val(),
                    };

                    $.ajax({
                        url: ApiLink.getTempletSettingData,
                        type: "GET",
                        contentType: 'application/json',
                        data: obj,
                        success: function (data) {
                            if (data.success) {
                                //TemplateSettingHelper.BuildtblSubCatList(data.table);
                                TemplateSettingHelper.BuildtblColumnList(data.data.ds.table);
                                TemplateSettingHelper.BuildtblRowList(data.data.ds.table1);
                            }
                            else {
                                swal({
                                    title: "Sorry!",
                                    text: data.Details,
                                    type: "error",
                                    closeOnConfirm: false,
                                });
                            }
                        },
                        error: function (data) {
                            swal({
                                title: "Sorry!",
                                text: "Something Went Wrong !!! \n" + data.data.details,
                                type: "error",
                                closeOnConfirm: false
                            });
                        }
                    });
                }
            });
    },

    SaveTemplateData: function () {
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {

                    if ($("#cmbTemplateType").val() == "") {
                        swal({
                            title: "Warning!",
                            text: "Please select template !",
                            type: "warning",
                            closeOnConfirm: false
                        });
                        return;
                    }
                    if ($("#cmbCategory").val() == "") {
                        swal({
                            title: "Warning!",
                            text: "Please select category !",
                            type: "warning",
                            closeOnConfirm: false
                        });
                        return;
                    }
                    //if ($("#cmbSubCategory").val() == 0) {
                    //    swal({
                    //        title: "Warning!",
                    //        text: "Please select sub-category !",
                    //        type: "warning",
                    //        closeOnConfirm: false
                    //    });
                    //    return;
                    //}
                    var CountRow = 0;
                    var CountColumn = 0;
                    var tblColumnList = $("#tblColumnList").DataTable();
                    var tblColumnListData = tblColumnList.rows().data().toArray().map(function (row, i) {
                        if (tblColumnList.cell(i, 0).nodes().to$().find('input:checked').val() == "on") {
                            CountColumn++;
                            return {
                                DESC1: row["subCode"],
                                DESC2: row["groupId"],
                                DESC3: (tblColumnList.cell(i, 8).nodes().to$().find('input').val() == "" ? 0 : tblColumnList.cell(i, 8).nodes().to$().find('input').val()),
                                DESC4: row["responsiblePerson"],
                            }
                        }
                    }).filter(item => item !== undefined);
                    var tblRowList = $("#tblRowList").DataTable();
                    var tblRowListData = tblRowList.rows().data().toArray().map(function (row, i) {
                        if (tblRowList.cell(i, 0).nodes().to$().find('input:checked').val() == "on") {
                            CountRow++;
                            return {
                                DESC1: row["subCode"],
                                DESC2: row["groupId"],
                                DESC3: (tblRowList.cell(i, 6).nodes().to$().find('input').val() == "" ? 0 : tblRowList.cell(i, 6).nodes().to$().find('input').val()),
                            }
                        }
                    }).filter(item => item !== undefined);
                    if (CountColumn == 0) {
                        swal({
                            title: "Warning!",
                            text: "Sorry, No column selected !",
                            type: "warning",
                            closeOnConfirm: false
                        });
                        return;
                    }
                    if (CountRow == 0) {
                        swal({
                            title: "Warning!",
                            text: "Sorry, No row selected !",
                            type: "warning",
                            closeOnConfirm: false
                        });
                        return;
                    }


                    var obj = {
                        COMC1: "",
                        DESC1: $("#cmbTemplateType").val(),
                        DESC2: $("#cmbCategory").val(),
                        DESC3: $("#cmbSubCategory").val() == "" ? "000000000000" : $("#cmbSubCategory").val(),
                        DESC4: $("#hdnUserId").val(),
                        DESC5: $("#hdnTermID").val(),
                    };

                    var jsonParam = {
                        objParam: obj,
                        objColumn: tblColumnListData,
                        objRow: tblRowListData,
                    };

                    jQuery.ajax({
                        url: ApiLink.SaveTemplateData,
                        type: "POST",
                        contentType: 'application/json',
                        data: JSON.stringify(jsonParam),
                        success: function (data) {
                            if (data.success) {
                                TemplateSettingHelper.GetTempleteData();
                                swal({
                                    title: "Congratulations!",
                                    text: "Saved Successfully.",
                                    type: "success",
                                    closeOnConfirm: false,
                                });
                            }
                            else {
                                swal({
                                    title: "Sorry!",
                                    text: data.data.message,
                                    type: "error",
                                    closeOnConfirm: false,
                                });
                            }
                        },
                        error: function (data) {
                            swal({
                                title: "Sorry!",
                                text: "Something Went Wrong !!! \n" + data.data.details,
                                type: "error",
                                closeOnConfirm: false
                            });
                        }
                    });
                }
            });
    },

    SaveTypeData: function () {
        if ($("#txtName").val() == "") {
            swal({
                title: "Warning!",
                text: "Please enter name !",
                type: "warning",
                closeOnConfirm: false
            });
            return;
        }

        var obj = {
            DESC1: $("#hdnTypeID").val(),
            DESC2: $("#txtName").val(),
            DESC3: "",
            DESC4: $("#hdnUserId").val(),
            DESC5: $("#hdnTermID").val(),
        };
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    jQuery.ajax({
                        url: ApiLink.SaveTypeData,
                        type: "POST",
                        contentType: 'application/json',
                        data: JSON.stringify(obj),
                        success: function (data) {
                            if (data.success) {
                                if ($("#hdnTypeID").val() == "110100010000") {
                                    TemplateSettingHelper.GenerateCombo($("#cmbCategory"), "SP_SELECT_DROPDOWN", "GETALLCODEGROUP", "110100010000", "", "", "", "");
                                    $("#cmbCategory").trigger("change");
                                }
                                else if ($("#hdnTypeID").val() == "110100020000") {
                                    TemplateSettingHelper.GenerateCombo($("#cmbSubCategory"), "SP_SELECT_DROPDOWN", "GETALLCODEGROUP", "110100020000", "", "", "", "");
                                    $("#cmbSubCategory").trigger("change");
                                }
                                else if ($("#hdnTypeID").val() == "110100030000") {
                                    TemplateSettingHelper.GenerateCombo($("#cmbColumnGroup"), "SP_SELECT_DROPDOWN", "GETALLCODEGROUP", "110100030000", "", "", "", "");
                                    $("#cmbColumnGroup").trigger("change");
                                }
                                else if ($("#hdnTypeID").val() == "110100040000") {
                                    TemplateSettingHelper.GetTempleteData();
                                }
                                else if ($("#hdnTypeID").val() == "110100050000") {
                                    TemplateSettingHelper.GetTempleteData();
                                }
                                else if ($("#hdnTypeID").val() == "110100060000") {
                                    TemplateSettingHelper.GenerateCombo($("#cmbTemplateType"), "SP_SELECT_DROPDOWN", "GETALLCODEGROUP", "110100060000", "", "", "", "");
                                    $("#cmbTemplateType").trigger("change");
                                }
                                swal({
                                    title: "Congratulations!",
                                    text: "Saved Successfully.",
                                    type: "success",
                                    closeOnConfirm: false,
                                });
                            }
                            else {
                                swal({
                                    title: "Sorry!",
                                    text: data.data.message,
                                    type: "error",
                                    closeOnConfirm: false,
                                });
                            }
                        },
                        error: function (data) {
                            swal({
                                title: "Sorry!",
                                text: "Something Went Wrong !!! \n" + data.data.details,
                                type: "error",
                                closeOnConfirm: false
                            });
                        }
                    });
                }
            });
    },

};