var dataSet = [];
var rows_selected = [];
var status;
var rowId = "";
var obj1 = new Object();
var obj2 = new Object();
$(function () {
    $("#textExpDate").datepicker({ format: "M-yyyy", autoclose: true, viewMode: "months", minViewMode: "months", 'forceParse': 0, endDate: '+0m', });
    $("#txtStartDate").datepicker({ format: "M-yyyy", autoclose: true, viewMode: "months", minViewMode: "months", 'forceParse': 0, endDate: '+0m', });
    $("#txtEndDate").datepicker({ format: "M-yyyy", autoclose: true, viewMode: "months", minViewMode: "months", 'forceParse': 0, endDate: '+0m', });

    $(document).ready(function () {
        alert();
        var locale = "en-us";
        var toDate = new Date(),
            tday = toDate.getDate(),
            tyear = toDate.getFullYear(),
            tmonth = toDate.toLocaleString(locale, { month: "short" });
        $("#textExpDate").datepicker('setDate', new Date(tmonth + '-' + tyear));
        $("#txtStartDate").datepicker('setDate', new Date(tmonth + '-' + tyear));
        $("#txtEndDate").datepicker('setDate', new Date(tmonth + '-' + tyear));
        $("#rdoDraft").prop("checked", true);
        MonthlyExpencesHelper.BuildtblExpDetails("");
    });

    $("#cmbProjectId").on("change", function (e) {
        var projectid = $("#cmbProjectId").val();
        MonthlyExpencesHelper.GenerateCombo($("#cmbProjectType"), "%", "ERPRENTDB.dbo.SP_SELECT_SERVICE_CHARGE", "GETCATAGORYLIST", projectid, "", "", "", "S");
        if (projectid != '') {
            MonthlyExpencesHelper.SearchprojectInformationByProjectCode();
            MonthlyExpencesHelper.SearchMonthlyExpencesList();
        }
        else {
            $("#txtper").val("0");
            $("#txtIndvExp").val("0");
            $("#txttotal").val("0");
            $('#tblExpencesDetails').DataTable().clear().draw();
        }
    });

    $("#cmbProjectType").on("change", function (e) {
        var Comcid = $("#cmbProjectId").val();
        var Catagory = $("#cmbProjectType").val();

        MonthlyExpencesHelper.SearchMonthlyExpencesList();
        MonthlyExpencesHelper.SearchTotalInfoByProjectCode(Comcid, Catagory);

    });

    $("#btnSubmit").click(function () {
        if ($("#textExpDate").val() === null || $("#textExpDate").val() === "") {
            swal({
                title: "Sorry!",
                text: "Please Select Month !",
                type: "error",
                closeOnConfirm: false
            });
        }
        else {
            var table = $("#tblExpencesDetails").DataTable();
            var infoData = table.data();
            var listitem = MonthlyExpencesHelper.CreateDetailsObject();
            if ($("#cmbProjectId").val() != null && $("#cmbProjectId").val() != "") {
                if ($("#cmbProjectType").val() != null && $("#cmbProjectType").val() != "") {
                    if (infoData.length > 0 && listitem.length > 0) {
                        swal({
                            title: "Do you want to save the changes?",
                            text: "",
                            type: "info",
                            showCancelButton: true,
                            closeOnConfirm: false,
                            showLoaderOnConfirm: true
                        }, function () {
                            setTimeout(function () {
                                MonthlyExpencesHelper.SaveMonthlyExpencesDetails();
                                $('.btnTmpEdit').prop("onclick", null).off("click");
                                $("#cmbProjectId").prop("disabled", true);
                                $("#txtProjectId").prop("disabled", true);
                                $("#cmbProjectType").prop("disabled", true);
                                if ($("#hdnRadiobtn").val() != "N") {

                                    $("#divMaster").find("input,select,textarea").prop("disabled", true);
                                }
                                //swal("sdkfjsd");
                            }, 60);
                        });
                    }
                    else {
                        swal({
                            title: "Sorry!",
                            text: "Please Insert Expences Amount !",
                            type: "error",
                            closeOnConfirm: false
                        });
                    }
                }
                else {
                    swal({
                        title: "Sorry!",
                        text: "Please Select Catagory Information !",
                        type: "error",
                        closeOnConfirm: false
                    });
                }
            }
            else {
                swal({
                    title: "Sorry!",
                    text: "Please Select Project Information !",
                    type: "error",
                    closeOnConfirm: false
                });
            }
        }
    });

    $("#btnNew").click(function () {
        location.reload();

    });

    $("#btnPrint").click(function () {
        MonthlyExpencesHelper.objectMonthlyExpences();
    });

    $("#btnsrch").click(function () {
        $("#txtper").val("0");
        $("#txtIndvExp").val("0");
        $("#txttotal").val("0");
        $("#txtttlCharge").val("0");
        $("#modal-default-Search").modal("show");
    });

    $("#btnSearch").click(function () {

        MonthlyExpencesHelper.SearchExpNoByDate();
        $("#SrcTable").show();
    });

    $("#txtper").on("input", function () {
        if ($("#txtper").val() > 100 || $("#txtper").val() < 0) {
            $("#txtper").val("0");
            //$("#txtttlCharge").val("0");           

            //MonthlyExpencesHelper.IndvAmountCalcualte();
            //$("#txtIndvExp").val("0");
            //$("#txttotal").val(parseFloat($("#hdnTotal").val()).toFixed(0));
            //MonthlyExpencesHelper.ProfitCalculate();
            swal({
                icon: 'warning',
                title: 'Warning!',
                text: 'Service Charge Less Then 100',
                type: "warning",
                closeOnConfirm: false,
                closeOnCancel: false,
                timer: 2000
            })

            return;
        }
        else {
            MonthlyExpencesHelper.IndvAmountCalcualte();
            //MonthlyExpencesHelper.ProfitCalculate();
        }


    });
});

var MonthlyExpencesHelper = {

    GenerateCombo: function (objcmb, comCostId, proName, callName, param1, param2, param3, param4, param5) {
        objcmb.empty();
        if (param5 === "S")

            $.getJSON("../Common/GenerateComboRealEstate/?comCostID=" + comCostId + '&procedureName=' + proName + '&callName=' + callName + '&Param1=' + param1 + '&Param2=' + param2 + '&Param3=' + param3 + '&Param4=' + param4)
                .done(function (data) {
                    var count = data.length;
                    if (count > 1) {
                        objcmb.append($("<option></option>").attr("value", "").text("-Select-"));
                        $.each(data, function (key, item) {
                            objcmb.append($("<option></option>").attr("value", item.Id).text(item.Name));
                        });
                    }
                    else {
                        $.each(data, function (key, item) {
                            objcmb.append($("<option></option>").attr("value", item.Id).text(item.Name));
                        });
                    }
                    if (objcmb[0].id == 'cmbProjectId') {
                        objcmb.prop('selectedIndex', 0);

                        objcmb.select2().trigger('change');

                    }
                    $('#cmbProjectId').select2();
                    $('#cmbProjectType').select2();
                    $('#cmbProjectType').select2().trigger('change');

                });
    },

    BuildtblExpDetails: function (tbldata) {
        $('#tblExpencesDetails').DataTable({
            "footerCallback": function (row, data, start, end, display) {
                var api = this.api(), data;
                var floatval = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                // Total over all pages
                var total = api
                    .column(4)
                    .data()
                    .reduce(function (a, b) {
                        return floatval(a) + floatval(b);
                    }, 0);

                total = total.toFixed(2);
                // Update footer
                $(api.column(4).footer()).html(
                    +total
                );
                $("#hdnTotal").val(total);
                MonthlyExpencesHelper.IndvAmountCalcualte();
            },
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            "bFilter": false,
            "bInfo": false,
            "searching": false,
            "paging": false,
            "ordering": false,
            "columns": [
                { "data": "SL" },
                { "data": "EXPCODE" },
                { "data": "EXPNAME" },
                { "data": "STATUS" },
                { "data": "AMOUNT" },
                { "data": "REMARKS" },
                { "data": null }
            ],

            "columnDefs": [

                { "className": "dt-right", "targets": [4] },
                { "className": "dt-center", "targets": [0, 1, 6] },
                { "width": "50%", "targets": [2] },
                { "width": "10%", "targets": [4] },

                {
                    "targets": [0],
                    "width": "2%",
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    },
                },
                {
                    "targets": [1, 3, 6],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [4],
                    "render": function (data, type, row, meta) {
                        var attrDisabled = '';
                        if ($("#hdnRadiobtn").val() != "N") {
                            attrDisabled = 'disabled';
                            //attrDisabled = '';
                        }
                        return '<input type="text" maxlength="10" size="16px"' +
                            'style="text-align: right; height=10px!important" maxlength="10"  id="txtamount" autocomplete="off" class="form-control input-sm" onkeypress="return MonthlyExpencesHelper.isDeciaml(this, event, 2)" ' +
                            'onchange="MonthlyExpencesHelper.CalculateAmount(this.value, ' + meta.row + ')" +' +
                            'name="x" value="' + row.AMOUNT + '" ' + attrDisabled + '/>';

                    }

                },
                {
                    "targets": [5],
                    "render": function (data, type, row, meta) {
                        var attrDisabled = '';
                        if ($("#hdnRadiobtn").val() != "N") {
                            attrDisabled = 'disabled';
                        }
                        return '<input type="text" size="16px"' +
                            'style="text-align: right; height=10px!important" maxlength="200"  id="" autocomplete="off" class="form-control input-sm"' +
                            'name="" value="' + row.REMARKS + '" ' + attrDisabled + '/>';

                    }

                },
                {
                    "targets": [6],
                    "render": function (data, type, row, meta) {
                        var attrDisabled = '';
                        if ($("#hdnRadiobtn").val() != "N") {
                            attrDisabled = 'disabled';
                        }
                        return '<button  type="button" class="pull-center btnAddition" onclick="MonthlyExpencesHelper.Edit(' + meta.row + ')" style="font-size:10px;" ' + attrDisabled + '>Edit</button>';
                    }
                }
            ],
        });
    },

    BuildExpSearchDetails: function (tbldata) {
        $('#tblExpSrcDetails').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,

            "columns": [
                { "data": "SL" },
                { "data": "EXPNOH" },
                { "data": "PDESC" },
                { "data": "EXPNO" },
                { "data": "EXPDATE" },
                { "data": "APPROVED" },
                { "data": "AMOUNT" },
                { "data": "NOTE" },
                { "data": null },
                { "data": "COMCID" },
                { "data": "CATAGORY" }
            ],
            "columnDefs": [

                { "className": "dt-right", "targets": [1, 6] },
                { "className": "dt-center", "targets": [4, 5, 8] },
                {
                    "targets": [3, 9, 10],
                    "visible": false,
                    "searchable": false
                }, {
                    "targets": [0],
                    "width": "2%",
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    },
                },

                {
                    "targets": [8],
                    "render": function (data, type, row, meta) {

                        return '<button id="" type="button" class="pull-center" onclick="MonthlyExpencesHelper.EditExpNo(\'' + row.EXPNO + '\',\'' + row.COMCID + '\',\'' + row.CATAGORY + '\', ' + meta.row + ')" style="font-size:10px;">View</button>';
                    }
                }
            ]

        });
    },

    CalculateAmount: function (_amount, rid) {
        var amount = parseFloat("0" + _amount);
        var table = $("#tblExpencesDetails").DataTable();
        table.cell(rid, 4).data(amount).draw();
    },

    ChkProjctId: function () {
        $("#cmbProjectId").empty();
        MonthlyExpencesHelper.GenerateCombo($("#cmbProjectId"), "%", "ERPRENTDB.dbo.SP_SELECT_SERVICE_CHARGE", "RENTEXPPROJECTLIST", $("#txtProjectId").val(), "", "", "", "S");
    },

    SearchprojectInformationByProjectCode: function () {
        debugger;
        var Comcid = $("#cmbProjectId").val();

        //$.getJSON("../SalesInformation/SearchSalesInformationByUnit/?mcomcod=" + "%" + '&unitId=' + unitCode)
        $.getJSON("../MonthlyExpences/SearchprojectInformationByProjectCode/?Comcid=" + Comcid)
            .done(function (data) {
                data = $.parseJSON(data);
                $("#txtProjectAddress").val(data.Table[0].COMCADD1);
            });

    },

    SearchTotalInfoByProjectCode: function (Comcid, Catagory) {
        $.getJSON("../MonthlyExpences/SearchTotalInfoByProjectCode/?Comcid=" + Comcid + '&Catagory=' + Catagory)
            .done(function (data) {
                data = $.parseJSON(data);
                $("#txtttlClint").val(data.Table[0].CLIENTNUM);
                $("#txtttlSize").val(data.Table[0].TOTALSIZE);
            });

    },

    SearchMonthlyExpencesList: function () {
        var Comcid = $("#cmbProjectId").val();
        var Catagory = $("#cmbProjectType").val();

        $.getJSON("../MonthlyExpences/SearchMonthlyExpencesList/?Comcid=" + Comcid + '&Catagory=' + Catagory)
            .done(function (data) {
                data = $.parseJSON(data);
                MonthlyExpencesHelper.BuildtblExpDetails(data.Table);
            });

    },

    SaveMonthlyExpencesDetails: function () {
        var obj = new Object();
        obj.COMCID = $("#cmbProjectId").val();
        obj.CATAGORY = $("#cmbProjectType").val();
        obj.EXPNO = $("#txtExpNo").val();
        obj.EXPDATE = $("#textExpDate").val();
        if ($("#rdoDraft").prop("checked")) {
            obj.APPROVED = $("#rdoDraft").val();
        }
        if ($("#rdoFinal").prop("checked")) {
            obj.APPROVED = $("#rdoFinal").val();
        }
        obj.NOTE = $("#textNote").val();
        obj.SRVCRG = $("#txtper").val();
        obj.POSTEDBYID = $("#hdnUserId").val();
        obj.POSTTRMID = $("#hdnTermID").val().substring(0, 18);

        if (obj.COMCID.length > 0) {
            var listitem = MonthlyExpencesHelper.CreateDetailsObject();
            var objDetails = JSON.stringify(obj);
            var newItemList = JSON.stringify(listitem);
            var jsonParam = "objDetails:" + objDetails + ',itemList:' + newItemList;
            var serviceUrl = "/MonthlyExpences/SaveMonthlyExpencesDetails";
            jQuery.ajax({
                url: serviceUrl,
                async: false,
                type: "POST",
                data: "{" + jsonParam + "}",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data.status == "Logout") {
                        location.reload();
                        return;
                    }
                    if (data.data03 == "AI") {
                        swal({
                            icon: 'warning',
                            title: 'Warning!',
                            text: 'Data  already exists for this Month !',
                            type: "warning",
                            closeOnConfirm: false,
                            closeOnCancel: false,
                            timer: 2000
                        })
                        return;
                    }
                    if (data.status) {
                        if ($("#rdoFinal").prop("checked")) {
                            $("#hdnRadiobtn").val(data.data02);
                            document.getElementById("btnPrint").hidden=false;
                        }
                        else {
                            $("#hdnRadiobtn").val("N");
                            $('#btnPrint').hide();
                            document.getElementById("btnPrint").hidden = true;
                        }
                        $("#txtExpNo").val(data.EXPNO);
                        $("#SrctxtExpno").val(data.data01);
                        MonthlyExpencesHelper.SearchExpDetailsByExpNo(data.data02, $("#cmbProjectId").val(), $("#cmbProjectType").val(), "")

                        swal({
                            title: "Congratulation!!",
                            text: "Save Successfully",
                            type: "success",
                            closeOnConfirm: false
                        });
                    } else {
                        swal({
                            title: "Sorry!",
                            text: "Failed to save!",
                            type: "error",
                            closeOnConfirm: false
                        });
                    }
                }
            });
        }
    },

    CreateDetailsObject: function () {
        var table = $("#tblExpencesDetails").DataTable();
        var detaildata = table.data();
        var datalist = [];
        for (var i = 0; i < detaildata.length; i++) {
            var obj = new Object();
            obj.EXPCODE = table.cell(i, 1).data();
            obj.AMOUNT = table.cell(i, 4).nodes().to$().find('input').val();
            obj.REMARKS = table.cell(i, 5).nodes().to$().find('input').val();
            //datalist.push(obj);
            if (obj.AMOUNT > 0) {
                datalist.push(obj);
            }
        }
        console.log(datalist);
        return datalist;

    },

    SearchExpNoByDate: function () {
        var StartDate = $("#txtStartDate").val();
        var EndDate = $("#txtEndDate").val();
        $.getJSON("../MonthlyExpences/SearchExpNoByDate/?StartDate=" + StartDate + '&EndDate=' + EndDate)
            .done(function (data) {
                $('#tblExpSrcDetails').DataTable().clear().draw();
                data = $.parseJSON(data);
                MonthlyExpencesHelper.BuildExpSearchDetails(data.Table);
            });

    },

    EditExpNo: function (expno, comcid, projecttype, rid) {
        $("#txtExpNo").val(expno);
        $('.btnTmpEdit').prop("onclick", null).off("click");
        $("#cmbProjectId").prop("disabled", true);
        $("#txtProjectId").prop("disabled", true);
        $("#cmbProjectType").prop("disabled", true);
        MonthlyExpencesHelper.SearchExpDetailsByExpNo(expno, comcid, projecttype, rid);
        $("#modal-default-Search").modal("hide");

    },

    SearchExpDetailsByExpNo: function (expno, comcid, projecttype, rid) {
        $.getJSON("../MonthlyExpences/SearchExpDetailsByExpNo/?expno=" + expno + '&comcid=' + comcid + '&projecttype=' + projecttype)
            .done(function (data) {
                data = $.parseJSON(data);
                $("#cmbProjectId").empty();
                $("#cmbProjectType").empty();
                $("#txtttlClint").val(data.Table[0].CLIENTNUM);
                $("#txtttlSize").val(data.Table[0].TOTALSIZE);
                $("#cmbProjectId").append($("<option></option>").attr("value", data.Table[0].COMCID).text(data.Table[0].COMCSNAM));
                $("#textExpDate").val(data.Table[0].EXPDATE);
                $("#SrctxtExpno").val(data.Table[0].EXPNOH);
                $("#txtProjectAddress").val(data.Table[0].COMCADD1);
                $("#cmbProjectType").append($("<option></option>").attr("value", data.Table[0].CATAGORY).text(data.Table[0].SUBDESC));
                //$("#cmbProjectType").val(item.CATAGORY); 
                $("#txtExpMonth").val("");

                if (data.Table[0].STATUS == "N") {
                    $('#btnSubmit').prop('disabled', false);
                    $("#rdoDraft").prop("checked", true);
                    $('#textNote').prop('disabled', false);
                    $('#rdoFinal').prop('disabled', false);
                    $('#rdoDraft').prop('disabled', false);
                    $("#rdoFinal").prop("checked", false);
                    $("#hdnRadiobtn").val("N");
                    document.getElementById("btnPrint").style.visibility = "hidden";

                } else {
                    $('#btnSubmit').prop('disabled', true);
                    $("#rdoFinal").prop("checked", true);
                    $('#rdoDraft').prop('disabled', true);
                    $('#textNote').prop('disabled', true);
                    $("#hdnRadiobtn").val("Y");
                    document.getElementById("btnPrint").style.visibility = "visible";
                }
                $("#textNote").val(data.Table[0].NOTE);
                $("#btnSubmit").html("Update");

                MonthlyExpencesHelper.BuildtblExpDetails(data.Table1);
                var totlalArea = $("#txtttlSize").val() == "" ? 1 : $("#txtttlSize").val();
                if ($("#cmbProjectType").val() == "Residential") {
                    $("#txtIndvExp").val(parseFloat(data.Table[0].TOTAL / $("#txtttlClint").val()).toFixed(0));
                }
                else if ($("#cmbProjectType").val() == "Commercial") {
                    $("#txtIndvExp").val(parseFloat(data.Table[0].TOTAL / totlalArea).toFixed(0));
                }
                //$("#txtIndvExp").val(data.Table[0].NOTE);
                $("#txtper").val(data.Table[0].SRVCRG);
                $("#txtttlCharge").val(data.Table[0].TOTALCHARGE);
                $("#txttotal").val(data.Table[0].TOTAL);
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
        var caratPos = MonthlyExpencesHelper.getSelectionStart(el);
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

    IndvAmountCalcualte: function () {
        var totlal = $("#hdnTotal").val();
        var charge = $("#txtper").val();
        var totalCharge = parseFloat((totlal * charge) / 100).toFixed(0);
        $("#txtttlCharge").val(totalCharge);
        $("#txttotal").val(parseFloat((parseFloat(totalCharge) + parseFloat(totlal))));

        var totlalArea = $("#txtttlSize").val() == "" ? 1 : $("#txtttlSize").val();
        var txtttlClint = $("#txtttlClint").val() == "" ? 1 : $("#txtttlClint").val();
        var txttotal = $("#txttotal").val();
        //if (parseFloat("0" + $("#txtper").val()) > 0) {
        var cmbval = $("#cmbProjectType option:selected").text();
        if ($("#cmbProjectType option:selected").text() == "RESIDENTIAL") {
            var a = parseFloat(txttotal / txtttlClint).toFixed(2);
            $("#txtIndvExp").val(a);
        }
        else if($("#cmbProjectType option:selected").text() == "COMMERCIAL") {
            var a = parseFloat(txttotal / totlalArea).toFixed(2);
            $("#txtIndvExp").val(a);
        }
        //}
        //else
        //{
        //    $("#txtIndvExp").val("0");
        //    $("#txtper").val("0");
        //    $("#txtIndvExp").val("0");
        //    $("#txtttlCharge").val("0");

        //}

    },

    objectMonthlyExpences: function (Month) {
        //param for RDLC
        obj1.PROCNAME = "ERPRENTDB.dbo.SP_SELECT_SERVICE_CHARGE";
        obj1.CALLTYPE = "GETDETAILSBYEXPNO";
        obj1.COMC1 = $("#cmbProjectId").val();
        obj1.DESC1 = $("#txtExpNo").val();
        obj1.DESC2 = $("#cmbProjectType").val();
        obj1.DESC3 = "";
        obj1.DESC4 = "";
        obj1.DESC5 = "";
        obj1.DESC6 = $("#hdnUserId").val();
        obj1.DESC7 = $("#hdnTermID").val();
        obj1.DESC8 = "";
        obj1.DESC9 = "";
        obj1.DESC10 = "";

        //param for DB
        obj2.DESC1 = "rptMonthlyExpences.rdlc";
        obj2.DESC2 = "dtMonthlyExpencesB";
        obj2.DESC3 = "dtMonthlyExpencesA";
        obj2.DESC4 = "";
        obj2.DESC5 = "rptRSM";
        MonthlyExpencesHelper.Report();
    },

    Report: function () {
        var objDBParameter = JSON.stringify(obj1);
        var objReportParameter = JSON.stringify(obj2);
        var jsonParam = "objDBParameter:" + objDBParameter + ',objReportParameter:' + objReportParameter;
        var serviceUrl = "/MonthlyExpences/PrintReport/";

        jQuery.ajax({
            url: serviceUrl,
            async: false,
            type: "POST",
            data: "{" + jsonParam + "}",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.status == "Logout") {
                    location.reload();
                    return;
                }
                if (data.status) {
                    var cmbViewType = "PDF";
                    window.open('../Reports/ReportViewerRDLC.aspx?exp=' + cmbViewType, '_blank');
                    //window.open('../Report/ReportViewer.aspx', '_blank');
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Report Record Not Found",
                        type: "info",
                        closeOnConfirm: false,
                        timer: 2000
                    });
                }
            }
        });
    },
};

