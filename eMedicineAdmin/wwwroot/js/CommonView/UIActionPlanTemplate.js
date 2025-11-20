let MapcoulmnId, MaprowId, categoryId, subcategoryId, RefMapRowId, firstTab, selectTab = "", ExecutionRowId, ResponsRowId, users = [], rowId;

$(function () {
    $(".select2").select2();   
    $("#divEndDate").hide();
    $("#lblStartDate").html("Target Date");
    $('.select2bs4').select2 ({
        theme: 'bootstrap4'
    });
    $(document).ready (function () {
        ActionPlanHelper.GenerateCombo($("#cmbProject"), "SP_SELECT_DROPDOWN", "GETPROJECTINFO", "", "", "", "", "");
        ActionPlanHelper.GenerateCombo($("#cmbCategory"), "SP_SELECT_DROPDOWN", "GETACTIONCATAGORY", $("#cmbProject").val(),"" , "", "", "");
        ActionPlanHelper.GenerateCombo($("#cmbWorkStatus"), "SP_SELECT_DROPDOWN", "GETALLCODEGROUP", "110100070000", "", "", "", "");
        ActionPlanHelper.GenerateCombo($("#cmbResponsPersion"), "SP_SELECT_DROPDOWN", "GETEMPLOYEE", "", "", "", "", "");
        ActionPlanHelper.GenerateCombo($("#cmbResponsiblePerson"), "SP_SELECT_DROPDOWN", "GETEMPLOYEE", "", "", "", "", "");
        ActionPlanHelper.GenerateCombo($("#cmbDateEvent"), "SP_SELECT_DROPDOWN", "GETDATEEVENT", "", "", "", "", ""); 

        $("#btnSaveTemplate").hide();
        $("#btnPrint").hide();
        $("#divConversation").hide();

        document.getElementById("btnSaveTemplate").style.visibility = "visible";
        document.getElementById("btnPrint").style.visibility = "visible";
        
        $("#txtStartDate").datepicker({ dateFormat: "dd-M-yy", changeMonth: true, changeYear: true, showButtonPanel: true, yearRange: "c-10:c+10" });
        //using upate date
        //$('#txtStartDate').datepicker({
        //    format: 'dd-M-yyyy',
        //    todayHighlight: true,
        //    autoclose: true
        //    , todayBtn: "linked", todayHighlight: true
        //});
        $("#txtStartDate").datepicker('setDate', new Date());

        $("#txtEndDate").datepicker({ dateFormat: "dd-M-yy", changeMonth: true, changeYear: true, showButtonPanel: true, yearRange: "c-10:c+10" });
        $("#txtEndDate").datepicker('setDate', new Date());

        $("#txtEffectiveDate").datepicker({ dateFormat: "dd-M-yy", changeMonth: true, changeYear: true, showButtonPanel: true, yearRange: "c-10:c+10" });
        $("#txtEffectiveDate").datepicker('setDate', new Date());     

        const now = new Date();
        const formattedDate = now.toLocaleString();
        $("#reportDate").text(formattedDate);

    });
    $("#btnNew").click(function () {
        location.reload();
    });
    $("#btnLoadMsg").click (function () {
        ActionPlanHelper.loadConversation();
    });
    $("#btnPrint").click(function () {
        $("#lblProject").text($('#cmbProject').find(":selected").text());
       
        window.print();
      
    });
    $("#btncloseTOC").on("click", function () {
        $("#main").addClass("hide-toc");
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
    $("#btnSaveTemplate").click(function () {
        if ($("#cmbProject").val() == "") {
            swal({
                title: "Warning!",
                text: "Please select Project !",
                type: "warning",
                closeOnConfirm: false
            });
            return;
        }
        if ($("#cmbTemplateType").val() == "") {
            swal({
                title: "Warning!",
                text: "Please select Template !",
                type: "warning",
                closeOnConfirm: false
            });
            return;
        }

        swal({
            title: "Are You Sure ?",
            text: "",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                ActionPlanHelper.SaveProjTemplateData();
            });
        });
    });
    $(document).on('click', '.tblDynamic thead tr th', function () {
        let rowIndex = $(this).parent().index();

        let colText = $(this).text().trim();
        let tableId = $(this).closest('table').attr('id');
        //console.log('Clicked column:', colText, 'from table:', tableId);

        $('.tblDynamic thead th').removeClass('header-selected');
        $(this).addClass('header-selected');
        //alert("You clicked Coulmn ID: " + rowIndex);
        $("#modal-PaymentDetails").modal("show");


    });
    $(document).on ("click", "td", function () {
        $("#main").addClass("hide-toc");
        $("td").css("background-color", "");

        $(this).css("background-color", "#b4dfff");

        let id = $(this).find(".medicine").data("id");
        console.log(id);
        if (id) {
            $("#main").removeClass("hide-toc");            
            const parts = id.split(',');
            categoryId = parts[0];
            subcategoryId = parts[1];
            MapcoulmnId = parts[2];
            MaprowId = parts[3];
            RefMapRowId = parts[4];
            //ActionPlanHelper.GetDetailsByCellId();
            //$("#modal-PaymentDetails").modal("show");
        }
        ActionPlanHelper.GetDetailsByCellId();
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // smooth scrolling effect
        });
    });
    $("#cmbProject").change (function () {
        if ($("#cmbProject").val() == "") {
            $("#DivTemplateType").attr("hidden", true);
            $("#DivCategory").attr("hidden", true);
            $("#lblMassage").html("");
            return;
        }
        $("#main").addClass("hide-toc");
        ActionPlanHelper.GenerateCombo($("#cmbCategory"), "SP_SELECT_DROPDOWN", "GETACTIONCATAGORY", $("#cmbProject").val(), "", "", "", "");
        ActionPlanHelper.GetActionPlan();
        if ($("#cmbProject").val()) {
            $("#chatUserName").html("Conversation for " + $("#cmbProject option:selected").text());
            ActionPlanHelper.loadConversation();
            $("#divConversation").show();
        }

    });
    $("#cmbCategory").change(function () {
        ActionPlanHelper.GetActionPlan();
    });
    $("#lblAddCategory").click(function () {        
        //$("#hdnTypeID").val("110100010000");
        //$("#lblAddType").html("Add Category");
        ActionPlanHelper.GenerateCombo($("#cmbCategory"), "SP_SELECT_DROPDOWN", "GETACTIONCATAGORY", $("#cmbProject").val(), "", "", "", "");
        ActionPlanHelper.GetActionPlan();
        //$("#modal-AddType").modal("show");
    });
    $("#btnSaveType").click(function () {
        if ($("#txtName").val() == "") {
            swal({
                title: "Warning!",
                text: "Please enter name !",
                type: "warning",
                closeOnConfirm: false
            });
            return;
        }

        swal({
            title: "Are You Sure ?",
            text: "",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                ActionPlanHelper.SaveTypeData();
            });
        });
    });
    $("#lblAddColumn").click(function () {
        $("#modal-UpdateTemplate").modal("hide");
        $("#hdnTypeID").val("110100040000");
        $("#lblAddType").html("Add Column");
        $("#modal-AddType").modal("show");
    });
    $("#lblAddRow").click(function () {
        $("#modal-UpdateTemplate").modal("hide");
        $("#hdnTypeID").val("110100050000");
        $("#lblAddType").html("Add Row");
        $("#modal-AddType").modal("show");
    });
    $("#cmbTemplateType").change(function () {
        if ($("#cmbTemplateType").val() == "") {
            $('#divTables').empty();
        }
        else {
            ActionPlanHelper.GetTemplateDetailForProj();
        }
    });
    $(document).on('click', '[data-toggle="modal"][data-target="#modal-UpdateTemplate"]', function () {
        ActionPlanHelper.GetProjTempForUpdate($(this).data('category-id'), $(this).data('category-name'));
        $("#hdnCategoryID").val($(this).data('category-id'));
        $("#hdnSubCategoryID").val($(this).data('sub-category-id'));
    });
    $("#btnUpdateTemplateRow").click(function () {
        ActionPlanHelper.UpdateProjTemplate();
    });
    $("#lblAddColumnGroup").click(function () {
        $("#modal-AddColumnGroup").modal("hide");
        $("#hdnTypeID").val("110100030000");
        $("#lblAddType").html("Add Column Group");
        $("#modal-AddType").modal("show");
    });
    $("#btnUpdateColumnGroup").click(function () {
        ActionPlanHelper.UpdateColumnGroup();
    });
    $("#btnUpdateResponsiblePerson").click(function () {
        ActionPlanHelper.UpdateResponsiblePerson();
    });

    $("#btnAddExecution").click(function () {
        $("#btnSubmit").html("Submit");
        $("#btnSubmit").val("S");
        $("#txtDescription, #txtDecision").val("");
        $("#txtStartDate").datepicker('setDate', new Date());
        $("#txtEndDate").datepicker('setDate', new Date());        
        $("#cmbWorkStatus").val("");
        $("#cmbWorkStatus").select2();
        $("#modal-Execution").modal("show");
        $("#cmbDateEvent").val("0");
        $("#cmbDateEvent").trigger("change");
    });

    $("#btnSubmit").click(function () {

        if ($("#txtDescription").val() == "" || $("#txtDescription").val() == null) {
            swal({
                title: "Warning!",
                text: "Please enter Description !",
                type: "warning",
                closeOnConfirm: false
            });
            $("#txtDescription").focus();
            return;
        }
        //if ($("#txtDecision").val() == "" || $("#txtDecision").val() == null) {
        //    swal({
        //        title: "Warning!",
        //        text: "Please enter Decision !",
        //        type: "warning",
        //        closeOnConfirm: false
        //    });
        //    return;
        //}
        if ($("#cmbWorkStatus").val() == "000000000000" || $("#cmbWorkStatus").val() == null || $("#cmbWorkStatus").val() == "") {
            swal({
                title: "Warning!",
                text: "Please enter Status !",
                type: "warning",
                closeOnConfirm: false
            });
            return;
        }
        swal({
            title: "Are You Sure ?",
            text: "",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                ActionPlanHelper.SaveExecutionData();
                $("#modal-Execution").modal("hide");

            });
        });
    });
    $("#btnSubRespons").click(function () {

        if ($("#cmbResponsPersion").val() == "" || $("#cmbResponsPersion").val() == null) {
            swal({
                title: "Warning!",
                text: "Please enter Description !",
                type: "warning",
                closeOnConfirm: false
            });
            return;
        }
        if ($("#txtEffectiveDate").val() == "" || $("#txtEffectiveDate").val() == null) {
            swal({
                title: "Warning!",
                text: "Please enter Decision !",
                type: "warning",
                closeOnConfirm: false
            });
            return;
        }
        swal({
            title: "Are You Sure ?",
            text: "",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            setTimeout(function () {
                ActionPlanHelper.SaveResponsibilitiesData();


            });
        });
    });
    $("#btnAddRespons").click(function () {
        $('#btnSubRespons').html("Submit");
        $('#btnSubRespons').val("S");
        $('#txtNote').val("");
        $("#txtEffectiveDate").datepicker('setDate', new Date());
        $('#cmbResponsPersion').val("00000000000");
        $('#cmbResponsPersion').select2();
        $("#modal-Respons").modal("show");
    });

    var $input = $('#txtMessage');

    $input.autocomplete ({
        source: [],
        minLength: 0,
        focus: function (event, ui) {
            event.preventDefault();
        },
        select: function (event, ui) {
            let val = $(this).val();
            let newVal = val.replace(/@\w*$/, '@' + ui.item.label + '<br/>' + '\n');
            $(this).val(newVal);
            $(this).autocomplete('close');

            // ReceiverID store
            let receiver = users.find(u => u.name === ui.item.label);
            $(this).data('receiver-id', receiver.id);
            //console.log('Selected Receiver ID:', receiver.id);

            return false;
        }
    });
    $input.on('keyup', function () {
        let val = $(this).val();
        let lastWord = val.split(' ').pop();

        if (lastWord.startsWith('@')) {
            let query = lastWord.substring(1).toLowerCase();
            let matches = users
                .filter(u => u.name.toLowerCase().includes(query))
                .map(u => ({ label: u.name, value: u.id }));

            $(this).autocomplete('option', 'source', matches);
            $(this).autocomplete('search', query);
        } else {
            $(this).autocomplete('close');
        }
    });
    $('#btnSend').click(function () {
        var text = $('#txtMessage').val().trim();
        if (text === '') return;
        ActionPlanHelper.SendConversationData(text);
        $('#txtMessage').val("");
    });
    $("#btnAddAttachment").click(function () {
        $("#file_input").val("");
        $("#modal-Attachment").modal("show");
    });
    $("#btnSubAttachment").click(function () {
        var fileInput = $('#file_input')[0];
        if (fileInput.files.length == 0) {
            swal({
                title: "Warning!",
                text: "Please Select a File !",
                type: "warning",
                closeOnConfirm: false
            });
            return;
        }
        ActionPlanHelper.SaveAttachmentData();
    });
    $("#cmbDateEvent").change (function () {
        if ($("#cmbDateEvent").val() == "") {
            $("#divEndDate").hide();
        }
        else if ($("#cmbDateEvent").val() == "0") {
            $("#lblStartDate").html("Target Date");
            $("#divEndDate").hide();
            $("#txtEndDate").datepicker('setDate', new Date());
        } else {
            $("#lblStartDate").html("Start Date");
            $("#divEndDate").show();
        }
    });
    $("#cmbCategory").change(function () {
        if ($("#cmbCategory").val() == "") {
            $("#DivTemplateType").attr("hidden", true);
            $("#DivCategory").attr("hidden", true);
            $("#lblMassage").html("");
            return;
        } else {
            $("#main").addClass("hide-toc");
            ActionPlanHelper.GetActionPlan();
            ActionPlanHelper.loadConversation();
            ActionPlanHelper.GetDetailsByCellId();
            $("#divConversation").show();
        }
       
        
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
    BuildGroupedDataTable: function (tableId, tbldata, Type) {
        if (Type == "Template") {
            $('#divTables').append('<div class="row"><div class= "col-sm-12" ><div class="card"><div class= "card-header" ><h4>' + tbldata[0].catagoryName + '</h4></div>' +
                '<div class="card-body"><table id="' + tableId + '" cellspacing="0" style="width: 100%; font-size: 10px;">' +
                '<thead><tr></tr></thead><tbody></tbody></table></div></div>');
        }
        else {
            $('#divTables').append('<div class="row"><div class= "col-sm-12" ><div class="card"><div class= "card-header"><h4 class="card-title">' + tbldata[0].catagoryName + '</h4>' +
                '<div class="card-tools float-right"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fa fa-minus"></i></button></div>' +
                '<button type="button" class="btn btn-info btn-sm float-right" data-toggle="modal" data-target="#modal-UpdateTemplate" data-sub-category-id="' + tbldata[0].subCategoryId + '"' +
                'data-category-id="' + tbldata[0].categoryId + '"data-category-name="' + tbldata[0].catagoryName + '">Add</button></div>' +
                '<div class="card-body"><table id="' + tableId + '" cellspacing="0" style="width: 100%; font-size: 10px;border: 1px solid black">' +
                '<thead><tr></tr></thead><tbody></tbody></table></div></div>');
        }
        if ($.fn.DataTable.isDataTable('#' + tableId)) {
            $('#' + tableId).DataTable().clear().destroy();
        }

        $('#' + tableId).empty();

        if (tbldata && tbldata.length > 0) {

            // Build DataTable column definitions
            const columns = Object.keys(tbldata[0]).map(function (key) {
                if (key !== "catagoryName" && key !== "categoryId" && key !== "subCategoryId" && key !== "countNum") {
                    return { data: key };
                    
                }
            }).filter(item => item !== undefined);

            let groupHeaderRow = '';
            let headerRow = '';
            let lastGroup = null;
            let groupSpanCount = 0;

            columns.forEach((col, i) => {
                if (col.data === "rowName") {
                    groupHeaderRow += '<th rowspan="2" class="text-left" >Items of Work</th>';

                }
                else {
                    const parts = col.data.split('_');
                    const colName = parts[0];
                    const groupName = parts[1];

                    if (lastGroup !== null && lastGroup !== groupName && lastGroup !== undefined) {
                        groupHeaderRow += '<th colspan="' + groupSpanCount + '">' + lastGroup + '</th>';
                        groupSpanCount = 0;
                    }

                    groupSpanCount++;
                    lastGroup = groupName;
                    if (colName === "mrf")
                    {
                        headerRow += '<th>' + ActionPlanHelper.toUpperCase(colName) + '</th>';

                    }else{
                        headerRow += '<th>' + ActionPlanHelper.toProperCase(colName) + '</th>';
                    }
                   
                }

                if (i === columns.length - 1 && lastGroup !== null && lastGroup !== undefined) {
                    groupHeaderRow += '<th colspan="' + groupSpanCount + '">' + lastGroup + '</th>';
                }
            });

            $('#' + tableId).append(
                '<thead style="background-color: #d1efd3;"><tr>' + groupHeaderRow + '</tr><tr>' + headerRow + '</tr></thead>'
            );
            $('#' + tableId).append('<tbody></tbody>');

            $('#' + tableId).DataTable({

                data: tbldata,
                paging: false,
                searching: true,
                info: false,
                ordering: false,
                autoWidth: false,
                columns: columns,                
                columnDefs: [
                    {
                        //targets: "_all",
                        targets: 0,
                        createdCell: function (td) {
                            $(td).css('text-align', 'left');
                        }
                    }
                ],

                createdRow: function (row, data, dataIndex) {
                    if (data.countNum > 0) {
                        $('td', row).remove();
                        $(row).append('<td class="filled-cell" style="font-weight:bold" colspan="' + (data.countNum + 1) + '">' + data.rowName + '</td>');
                    }
                }

            });

        } else {
            $('#' + tableId).append('<thead><tr><th>No Data Available</th></tr></thead>');
            $('#' + tableId).append('<tbody></tbody>');
        }
        var $table = $('#' + tableId);
        if ($table.length) {
            $table.find('th,tr, td').css('border', '1px solid black');
            $table.css('border-collapse', 'collapse');
        }
    },
    GetActionPlan: function () {
        var obj = {
            DESC1: $("#cmbProject").val(),
            DESC2: $("#cmbCategory").val(),
            DESC3: "",
        };
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    $.ajax({
                        url: ApiLink.GetActionPlan,
                        type: "GET",
                        data: obj,
                        dataType: "json",
                        success: function (data) {
                            $("#lblMassage").html("");
                            $("#DivTemplateType").attr("hidden", true);
                            $("#btnSaveTemplate").hide();
                            $("#DivCategory").attr("hidden", true);
                            $('#divTables').empty();
                            if (data.success) {
                                $("#DivCategory").attr("hidden", false);
                                var ds = data.data.ds;
                                for (var key in ds) {
                                    if (ds.hasOwnProperty(key)) {
                                        var tableData = ds[key];
                                        ActionPlanHelper.BuildGroupedDataTable(key, tableData, "Project");
                                    }
                                }
                                $("#btnPrint").show();
                            }
                            else {
                                $("#main").addClass("hide-toc");
                                ActionPlanHelper.GenerateCombo($("#cmbTemplateType"), "SP_SELECT_DROPDOWN", "GETALLCODEGROUP", "110100060000", "", "", "", "");
                                $("#DivTemplateType").attr("hidden", false);
                                $("#btnSaveTemplate").show();
                                $("#DivCategory").attr("hidden", true);
                                $("#lblMassage").html(data.message + "\n Please Select Template.");
                                $("#btnPrint").hide();
                                swal({
                                    title: "Sorry!",
                                    text: data.message + "\n Please Select Template.",
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
    GetDetailsByCellId: function () {
        var obj = {
            DESC1: categoryId,
            DESC2: subcategoryId,
            DESC3: MapcoulmnId,
            DESC4: MaprowId,
            DESC5: RefMapRowId,
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

                                // Row Coulmn Details Section
                                $('#lblCategory').html("Category : " + ds.table[0].categoryName);
                                $('#lblSubCategory').html("Sub Category : " + ds.table[0].subCategoryName);
                                $('#lblCoulmn').html("Column : " + ds.table[0].coulmnName);
                                $('#lblRow').html("Row : " + ds.table[0].rowName);


                                // Tabs Sections
                                var htmlTabs = '<div class="tab">';
                                ds.table3.forEach(function (item, index) {
                                    htmlTabs += '<button class="tablinks" onclick="ActionPlanHelper.openTbls(event, \''
                                        + item.subcode + '\')"'
                                        + (index === 0 ? ' id="firstTab"' : '') + '>'
                                        + item.subdesc + '</button>';
                                });
                                htmlTabs += '</div>';
                                document.getElementById('tabContainer').innerHTML = htmlTabs;

                                var tabLinks = document.getElementsByClassName("tablinks");
                                var firstTab = tabLinks[0];
                                if (selectTab === "") {
                                    selectTab = "110100080001";
                                    ActionPlanHelper.openTbls(null, selectTab);

                                    if (firstTab) firstTab.className += " active";
                                } else {
                                    ActionPlanHelper.openTbls(null, selectTab);
                                    for (var i = 0; i < tabLinks.length; i++) {
                                        if (tabLinks[i] && tabLinks[i].getAttribute('onclick').includes("'" + selectTab + "'")) {
                                            tabLinks[i].className += " active";
                                            break;
                                        }
                                    }
                                }

                                //Execution Plan Section
                                var containerExecution = document.getElementById('divExecution');
                                containerExecution.innerHTML = '';
                                ds.table1.forEach(function (row, index) {
                                    var divExecution = document.createElement('div');
                                    divExecution.className = 'item-box';
                                    divExecution.setAttribute('data-id', row.rowId);
                                    divExecution.innerHTML =
                                        '<b style ="color:Green; font-size:15px" >' + row.divdateEvent + '</b>' + ' <b class="pull-right">' + row.rowDate + '</b> <br>' +
                                        'Description: ' + row.workDescription + '<br>' +
                                        'Decision: ' + row.meetingDecision + '<br>' +
                                        'Work Status: ' + row.workStatus;

                                    divExecution.addEventListener('click', function () {

                                        $('.item-box').css('background-color', '');
                                        var id = this.getAttribute('data-id');
                                        ActionPlanHelper.GetExecutionDetailsByRowId(id);
                                        $(this).css('background-color', '#D3D3D3');                                       
                                    });

                                    containerExecution.appendChild(divExecution);
                                });

                                //Responsible Persions section
                                var containerRespons = document.getElementById('divRespons');
                                containerRespons.innerHTML = '';
                                ds.table2.forEach(function (row, index) {
                                    var divRespons = document.createElement('div');
                                    divRespons.className = 'item-box';
                                    divRespons.setAttribute('data-id', row.rowId);
                                    divRespons.innerHTML =
                                        '<b style ="color:Green; font-size:15px" >' + row.resPersion + '</b>' + ' <b class="pull-right">' + row.rowDate + '</b> <br>' +
                                        'Effected Date: ' + row.effectedDate + '<br>' +
                                        'Note: ' + row.note + '<br>';

                                    //divRespons.addEventListener('click', function () {

                                    //    $('.item-box').css('background-color', '');
                                    //    var id = this.getAttribute('data-id');
                                    //    ActionPlanHelper.GetResponsDetailsByRowId(id);
                                    //    $(this).css('background-color', '#D3D3D3');
                                    //});

                                    containerRespons.appendChild(divRespons);
                                });

                                // File Attachment section
                                var containerRespons = document.getElementById('divAttachment');
                                containerRespons.innerHTML = '';
                                // Use ⬇ Download File button
                                //ds.table4.forEach(function (row, index) {
                                //    var divAttachment = document.createElement('div');
                                //    divAttachment.className = 'item-box';
                                //    divAttachment.setAttribute('data-id', row.rowId);
                                //    var html =
                                //        '<b style="color:Green; font-size:15px;">' + row.attachmentName + '</b>' +
                                //        '<b class="pull-right">' + row.rowDate + '</b><br>' +
                                //        'Note: ' + row.note + '<br>';

                                //    if (row.filePath && row.filePath.trim() !== "") {
                                //        var fileUrl = ApiLink.BaseUrl + row.filePath;

                                //        html += '<a href="' + fileUrl + '" target="_blank" download ' +
                                //            'class="btn btn-sm btn-outline-primary mt-2">⬇ Download File</a>';
                                //    }

                                //    divAttachment.innerHTML = html;
                                //    containerRespons.appendChild(divAttachment);
                                //});

                                // Without Use ⬇ Download File button
                                ds.table4.forEach(function (row, index) {
                                    var divAttachment = document.createElement('div');
                                    divAttachment.className = 'item-box';
                                    divAttachment.setAttribute('data-id', row.rowId);
                                    divAttachment.style.cursor = 'pointer';

                                    var html =
                                        '<b style="color:Green; font-size:15px;">' + row.attachmentName + '</b>' +
                                        '<b class="pull-right">' + row.rowDate + '</b><br>' +
                                        'Note: ' + row.note + '<br>';

                                    divAttachment.innerHTML = html;

                                   
                                    if (row.filePath && row.filePath.trim() !== "") {
                                        var fileUrl = ApiLink.BaseUrl + row.filePath;

                                        divAttachment.addEventListener('click', function () {
                                            window.open(fileUrl, '_blank');
                                        });
                                    }

                                    containerRespons.appendChild(divAttachment);
                                });


                                
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
    SaveExecutionData: function () {

        var obj = {
            DESC1: RefMapRowId,
            DESC2: $("#txtStartDate").val(),
            DESC3: ($("#cmbDateEvent").val() == "0" ? $("#txtStartDate").val():$("#txtEndDate").val()),
            DESC4: $("#txtDescription").val(),
            DESC5: $("#txtDecision").val(),
            DESC6: $("#cmbWorkStatus").val(),
            DESC7: $("#hdnUserId").val(),
            DESC8: $("#hdnTermID").val(),
            DESC9: $('#btnSubmit').val(),
            DESC10: ExecutionRowId,
        };
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    jQuery.ajax({
                        url: ApiLink.SaveExecutionData,
                        type: "POST",
                        contentType: 'application/json',
                        data: JSON.stringify(obj),
                        success: function (data) {
                            if (data.success) {
                                swal({
                                    title: "Congratulations!",
                                    text: "Saved Successfully.",
                                    type: "success",
                                    closeOnConfirm: false,
                                });

                                ActionPlanHelper.GetDetailsByCellId();
                                ActionPlanHelper.GetActionPlan();
                                $("#modal-Execution").modal("hide");
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
    SaveResponsibilitiesData: function () {

        var obj = {
            DESC1: RefMapRowId,
            DESC2: $("#cmbResponsPersion").val(),
            DESC3: $("#txtEffectiveDate").val(),
            DESC4: $("#txtNote").val(),
            DESC5: $("#hdnUserId").val(),
            DESC6: $("#hdnTermID").val(),
            DESC7: $('#btnSubRespons').val(),
            DESC8: ResponsRowId,
        };
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    jQuery.ajax({
                        url: ApiLink.SaveResponsibilitiesData,
                        type: "POST",
                        contentType: 'application/json',
                        data: JSON.stringify(obj),
                        success: function (data) {
                            if (data.success) {
                                swal({
                                    title: "Congratulations!",
                                    text: "Saved Successfully.",
                                    type: "success",
                                    closeOnConfirm: false,
                                });

                                ActionPlanHelper.GetDetailsByCellId();
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
    SaveAttachmentData: function () {

        var formData = new FormData();
        formData.append("DESC1", $('#cmbProject').val());
        formData.append("DESC2", RefMapRowId);
        formData.append("DESC3", $('#txtNoteAttachment').val());
        formData.append("DESC4", $('#hdnUserId').val());
        formData.append("DESC5", $('#hdnTermID').val());
        var fileInput = $('#file_input')[0];
        if (fileInput.files.length > 0) {
            formData.append("DESC31", fileInput.files[0]);
        }

        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    jQuery.ajax({
                        url: ApiLink.SaveAttachmentData,
                        type: "POST",
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            if (data.success) {
                                swal({
                                    title: "Congratulations!",
                                    text: "Saved Successfully.",
                                    type: "success",
                                    closeOnConfirm: false,
                                });

                                ActionPlanHelper.GetDetailsByCellId();
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
    openTbls: function (evt, tabValue) {
        selectTab = tabValue;
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabValue).style.display = "block";

        if (evt && evt.currentTarget) {
            evt.currentTarget.className += " active";
        } else {

            for (i = 0; i < tablinks.length; i++) {
                if (tablinks[i].textContent === tabValue) {
                    tablinks[i].className += " active";
                    break;
                }
            }
        }

    },
    GetExecutionDetailsByRowId: function (rowId) {
        ExecutionRowId = rowId;
        var obj = {
            DESC1: rowId,
        };
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    $.ajax({
                        url: ApiLink.GetExecutionDetailsByRowId,
                        type: "GET",
                        data: obj,
                        dataType: "json",
                        success: function (data) {
                            if (data.success) {
                                var ds = data.data.ds;
                                $('#btnSubmit').html("Update");
                                $('#btnSubmit').val("U");                                                             
                                $('#txtStartDate').val(ds.table[0].startDate);
                                $('#txtEndDate').val(ds.table[0].endDate);
                                $('#txtDescription').val(ds.table[0].workDescription);
                                $('#txtDecision').val(ds.table[0].meetingDecision);
                                $('#cmbWorkStatus').val(ds.table[0].workStatus);
                                $("#cmbWorkStatus").select2();      
                                $('#cmbDateEvent').val(ds.table[0].dateEvent).trigger('change');
                                $('#cmbDateEvent').select2();
                               
                                $("#modal-Execution").modal("show");
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
    loadConversation: function () {
        var currentUserId = $('#hdnUserId').val();
        $('#chatMessages').empty();
        var obj = {
            DESC1: $("#cmbProject").val(),
        };
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    $.ajax({
                        url: ApiLink.loadConversation,
                        type: "GET",
                        data: obj,
                        dataType: "json",
                        success: function (data) {
                            if (data.success) {
                                var ds = data.data.ds;
                                var messages = ds.table;
                                $.each(messages, function (i, msg) {
                                    var cls = msg.senderId === currentUserId ? 'sent' : 'received';
                                    var html = '<div class="message ' + cls + '">' + msg.messageText + '</div>';
                                    $('#chatMessages').append(html);
                                });

                                users = ds.table1;
                                ActionPlanHelper.scrollToBottom();
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
    SendConversationData: function (text) {

        var obj = {
            DESC1: $("#cmbProject").val(),
            DESC2: $("#hdnUserId").val(),
            DESC3: $('#txtMessage').data('receiver-id'),
            DESC4: text,
        };
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    jQuery.ajax({
                        url: ApiLink.SendConversationData,
                        type: "POST",
                        contentType: 'application/json',
                        data: JSON.stringify(obj),
                        success: function (data) {
                            if (data.success) {
                                ActionPlanHelper.loadConversation();
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
        var caratPos = ActionPlanHelper.getSelectionStart(el);
        var dotPos = el.value.indexOf(".");
        if (caratPos > dotPos && dotPos > -1 && (number[1].length > deci_point - 1)) {
            return false;
        }
        return true;
    },
    BuildtblRowList: function (tbldata) {
        $('#tblRowList').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            "order": false,
            "info": false,
            "lengthChange": false,
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
                        return '<input size="9px" value="' + parseFloat(data).toFixed(2) + '" maxlength="15" style="text-align: right;height=10px!important;" onkeypress="return ActionPlanHelper.isDeciaml(this, event, 2)">';
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
                        //'<button type="button" style="color:blue;text-decoration:underline;font-style:italic;border:none;background-color:inherit;font-size:9px;font-weight:bold;"  onclick="SupplierBillHelper.GetViewBillDetailByID(' + meta.row + ')"><i class="fa fa-pencil"></i></button>';
                    }
                }
            ]
        });
    },
    BuildtblColumnList: function (tbldata) {
        $('#tblColumnList').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            "order": false,
            "info": false,
            "lengthChange": false,
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
                    "targets": [1, 2, 3, 4, 9],
                    "visible": false
                },
                {
                    "targets": [5, 6, 7],
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
                        return '<input size="10px" value="' + parseFloat(data).toFixed(2) + '" maxlength="15" style="text-align: right;height=10px!important;width:50px" onkeypress="return ActionPlanHelper.isDeciaml(this, event, 2)">';
                    },
                    "orderable": true,
                    "searchable": false
                },
                {
                    "targets": [6],
                    "width": "2%",
                    "render": function (data, type, row, meta) {
                        return '<button type="button" style="color:blue;font-style:italic;border:none;background-color:inherit;font-size:8px;font-weight:bold;"  onclick="ActionPlanHelper.GetColumnGroupForUpdate(' + meta.row + ')">' + data + '</button>';
                    }
                },
                {
                    "targets": [7],
                    "width": "2%",
                    "render": function (data, type, row, meta) {
                        return '<button type="button" style="color:blue;tfont-style:italic;border:none;background-color:inherit;font-size:8px;font-weight:bold;"  onclick="ActionPlanHelper.GetResponsiblePersonForUpdate(' + meta.row + ')">' + data + '</button>';
                    }
                }
            ],
            drawCallback: function () {
                $('.dataTables_paginate ul.pagination li a').css({
                    'padding': '0px 2px',
                    'font-size': '10px',
                    'line-height': '1'
                });
            }

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
        var table = $("#tblColumnList").DataTable();
        table.cell(rowId, 3).data($("#cmbColumnGroup").val()).draw();
        table.cell(rowId, 5).data($("#cmbColumnGroup").children("option:selected").text()).draw();
        $("#modal-AddColumnGroup").modal("hide");
    },
    UpdateResponsiblePerson: function () {
        var table = $("#tblColumnList").DataTable();
        table.cell(rowId, 4).data($("#cmbResponsiblePerson").val()).draw();
        table.cell(rowId, 7).data($("#cmbResponsiblePerson").children("option:selected").text()).draw();
        $("#modal-AddResponsiblePerson").modal("hide");
    },
    GetProjTempForUpdate: function (CatId, CatName) {
        var obj = {
            DESC1: $("#cmbProject").val(),
            DESC2: CatId,
            DESC3: "",
        };
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    $.ajax({
                        url: ApiLink.GetProjTempForUpdate,
                        type: "GET",
                        data: obj,
                        dataType: "json",
                        success: function (data) {
                            $("#lblUpdateTemplate").html("Update Rows & Column of Category: " + CatName);
                            if (data.success) {
                                $("#lblRowModal").html("");
                                ActionPlanHelper.BuildtblRowList(data.data.ds.table);
                                ActionPlanHelper.BuildtblColumnList(data.data.ds.table1);
                                $("#tblRowList").show();
                                $("#btnUpdateTemplateRow").show();
                            }
                            else {
                                $("#lblRowModal").html("Something Went Wrong.");
                                $("#tblRowList").hide();
                                $("#btnUpdateTemplateRow").hide();
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
    GetTemplateDetailForProj: function () {
        var obj = {
            DESC1: $("#cmbProject").val(),
            DESC2: $("#cmbTemplateType").val(),
            DESC3: "",
        };
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    $.ajax({
                        url: ApiLink.GetTemplateDetailForProj,
                        type: "GET",
                        data: obj,
                        dataType: "json",
                        success: function (data) {
                            $('#divTables').empty();

                            if (data.success) {
                                var ds = data.data.ds;
                                for (var key in ds) {
                                    if (ds.hasOwnProperty(key)) {
                                        var tableData = ds[key];
                                        ActionPlanHelper.BuildGroupedDataTable(key, tableData, "Template");
                                    }
                                }
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
    SaveTypeData: function () {
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
                                    ActionPlanHelper.GenerateCombo($("#cmbCategory"), "SP_SELECT_DROPDOWN", "GETALLCODEGROUP", "110100010000", "", "", "", "");
                                    $("#cmbCategory").trigger("change");
                                }
                                else if ($("#hdnTypeID").val() == "110100030000") {
                                    ActionPlanHelper.GenerateCombo($("#cmbColumnGroup"), "SP_SELECT_DROPDOWN", "GETALLCODEGROUP", "110100030000", "", "", "", "");
                                    $("#cmbColumnGroup").trigger("change");
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
    SaveProjTemplateData: function () {

        var obj = {
            DESC1: $("#cmbProject").val(),
            DESC2: $("#cmbTemplateType").val(),
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
                        url: ApiLink.SaveProjTemplateData,
                        type: "POST",
                        contentType: 'application/json',
                        data: JSON.stringify(obj),
                        success: function (data) {
                            if (data.success) {
                                ActionPlanHelper.GetActionPlan();
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
    UpdateProjTemplate: function () {
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
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

                    swal({
                        title: "Are You Sure ?",
                        text: "",
                        type: "info",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true
                    }, function () {
                        setTimeout(function () {
                            var obj = {
                                COMC1: "",
                                DESC1: $("#cmbProject").val(),
                                DESC2: $("#hdnCategoryID").val(),
                                DESC3: $("#hdnSubCategoryID").val(),
                                DESC4: $("#hdnUserId").val(),
                                DESC5: $("#hdnTermID").val(),
                            };

                            var jsonParam = {
                                objParam: obj,
                                objColumn: tblColumnListData,
                                objRow: tblRowListData,
                            };

                            jQuery.ajax({
                                url: ApiLink.UpdateProjTemplateData,
                                type: "POST",
                                contentType: 'application/json',
                                data: JSON.stringify(jsonParam),
                                success: function (data) {
                                    if (data.success) {
                                        ActionPlanHelper.GetActionPlan();
                                        swal({
                                            title: "Congratulations!",
                                            text: "Saved Successfully.",
                                            type: "success",
                                            closeOnConfirm: false,
                                        });
                                        $("#modal-UpdateTemplate").modal("hide");
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
                        });
                    });
                }
            });
    },
    scrollToBottom: function () {
        var chatBody = $("#chatMessages");
        chatBody.scrollTop(chatBody.prop("scrollHeight"));
    },
    toProperCase: function (str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
    toUpperCase: function (str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.toUpperCase();
        });
    }
};