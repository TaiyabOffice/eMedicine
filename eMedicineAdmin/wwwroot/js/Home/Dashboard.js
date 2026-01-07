var rowId = "", users = [];
let progress = 0; // initial value
$(function () {
    $(".select2").select2();
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });

    $(document).ready(function () {
        DashboardHelper.GenerateCombo($("#cmbStatus"), "SP_SELECT_DROPDOWN", "GETCOMPLETIONTYPEDESHBOARD", "", "", "", "", "");
        //DashboardHelper.BuildtblDashboard();
        DashboardHelper.GetDashboardData($("#hdnUserId").val());

        var calendarEl = document.getElementById('calendar');

        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            height: 290,
            contentHeight: 250,
            aspectRatio: 1.5,
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            themeSystem: 'bootstrap'
        });

        calendar.render();
    });
    $('#btnSend').click(function () {
        var text = $('#txtMessage').val().trim();
        if (text === '') return;
        DashboardHelper.SendConversationData(text);
        $('#txtMessage').val("");
    });
    $("#btnSubAttachment").click(function () {
        let progress = parseInt($('#myProgressBar').text());
        if ($("#cmbStatus").val() == "" || $("#cmbStatus").val() == null) {
            swal({
                title: "Warning!",
                text: "Please Select Status",
                type: "warning",
                closeOnConfirm: false,
            });
            return;
        }
        if ($("#cmbStatus").val() == "110100070002" && progress <= 0) {
            swal({
                title: "Warning!",
                text: "Please Update Your Progress",
                type: "warning",
                closeOnConfirm: false,
            });
            return;
        }
        if ($("#cmbStatus").val() == "110100070002" && progress == 100) {
            swal({
                title: "Warning!",
                text: "Your Work Starus and Progress is not Valid ",
                type: "warning",
                closeOnConfirm: false,
            });
            return;
        }
        DashboardHelper.SaveAttachmentData();
    });

    var $input = $('#txtMessage');

    $input.autocomplete({
        source: [],
        minLength: 0,
        appendTo: ".modal-body", // 🔥 modal এর ভিতরে render হবে
        focus: function (event, ui) {
            event.preventDefault();
        },
        select: function (event, ui) {
            let val = $(this).val();
            let newVal = val.replace(/@\w*$/, '@' + ui.item.label + '<br/>' + '\n');
            $(this).val(newVal);
            $(this).autocomplete('close');

            let receiver = users.find(u => u.name === ui.item.label);
            $(this).data('receiver-id', receiver.id);
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

    $("#cmbProject").change(function () {
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

    $("#cmbStatus").change(function () {
        if ($("#cmbStatus").val() == "110100070001" || $("#cmbStatus").val() == "110100070004" || $("#cmbStatus").val() == "110100070006" || $("#cmbStatus").val() == "110100070007") {
            progress = 100;
        }

        $('#myProgressBar')
            .css('width', progress + '%')
            .attr('aria-valuenow', progress)
            .text(progress + '%');

    });
});

var DashboardHelper = {
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
                    '<option value="">' + '-Select-' + '</option>' +
                    data.map(function (item) {
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
    SendConversationData: function (text) {
        var obj = {
            DESC1: $('#hdnCompanyID').val(),
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
                                DashboardHelper.loadConversation($('#hdnCompanyID').val());
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
    UpdateStatusFromDiv: function (Label, RefRowId, Companyid, progressValue) {
        $('#hdnCompanyID').val("");
        $('#hdnRefRowid').val("");
        $("#lblStatus").html("Update Status for " + Label);
        $('#hdnCompanyID').val(Companyid);
        $('#hdnRefRowid').val(RefRowId);
        $("#cmbStatus").prop("selectedIndex", 0).select2();
        progress = parseInt(progressValue);
        $('#myProgressBar')
            .css('width', progressValue + '%')
            .attr('aria-valuenow', progressValue)
            .text(progressValue + '%');
        $("#modal-Status").modal("show");
    },
    SetMessagesFromDiv: function (Label, Companyid) {
        $('#hdnCompanyID').val("");
        $('#hdnRefRowid').val("");
        $("#chatUserName").html("Conversation for " + Label);
        $('#hdnCompanyID').val(Companyid);
        DashboardHelper.loadConversation($('#hdnCompanyID').val());
    },
    loadConversation: function (ProjectId) {
        var currentUserId = $('#hdnUserId').val();
        $('#chatMessages').empty();
        var obj = {
            DESC1: ProjectId,
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
                                console.log(ds.table1);
                                DashboardHelper.scrollToBottom();
                                $("#modal-Message").modal("show");
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
    scrollToBottom: function () {
        var chatBody = $("#chatMessages");
        chatBody.scrollTop(chatBody.prop("scrollHeight"));
    },
    GetDashboardData: function (userId) {
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    var obj = {
                        DESC1: userId, 
                    };

                    $.ajax({
                        url: ApiLink.GetDashboardData,
                        type: "GET",
                        contentType: 'application/json',
                        data: obj,
                        success: function (data) {
                            if (data.success) {
                                $("#item").empty();

                                //DashboardHelper.BuildtblDashboard(data.data.ds.table);

                                DashboardHelper.WorkCompletion(data.data.ds.table4);
                                DashboardHelper.WorkSummary(data.data.ds.table4);
                                DashboardHelper.loadDonutChart(data.data.ds.table4);
                                var ds = data.data.ds;
                                for (var key in ds) {
                                    if (ds.hasOwnProperty(key)) {
                                        var tableData = ds[key];
                                        if ((key != "table") && (key != "table4")) {
                                            $('#item').append("<div class='col-lg-4 col-xs-6 myItem' style ='cursor: pointer;'><div style='background-color:" + tableData[0].refName + "'><div class='inner' style='margin:5px;padding:5px;'>" +
                                                "<center><h3 style='font-size:20px'>" + tableData[0].title + "</h3></center><ul class='col-md-12' id='" + key + "' style='position: static;list-style-type: none;min-height:100px;'></ul></div><div class='icon'></div>" +
                                                "</div></div>");

                                            if (tableData.length > 1) {
                                                var count = 0;
                                                var isdisable = "";
                                                for (var j = 0; j < tableData.length && count<=5; j++) {
                                                    if (tableData[j].project != "") {
                                                        if (tableData[j].workStatus === "110100070001") {
                                                            isdisable = "hidden";
                                                        } else {
                                                            isdisable = "";
                                                        }
                                                        $('#' + key).append("<li class='myPart'><div class='row'><div class='col-sm-12'><p><span style='color:blue'>Project</span>" +
                                                            "<span style = 'color:black'>    " + tableData[j].project + "</span>" +
                                                            "</p></div></div><div class='row'><div class='col-sm-12'><p><span style='color:blue'>Category</span>" +
                                                            "<span style ='color:black'>    " + tableData[j].catSubcatName + "</span>" +
                                                            "</p></div></div><div class='row'><div class='col-sm-12'><p><span style='color:blue'>Work</span>" +
                                                            "<span style='color:black'>    " + tableData[j].coulmnRowName + "</span></p></div></div>" +
                                                            "<div class='row'> <div class='col-sm-12'><p><span style='color:blue'>Date</span>" +
                                                            "<span style='color:black'>    " + tableData[j].cellValue + "</span></p></div></div>" +
                                                            "<div class='row'> <div class='col-sm-12'><p><span style='color:blue'>Work Progress</span></p> \
                                                             <div class='progress' style='height:20px;'> \
                                                             <div class='progress-bar bg-success' role='progressbar' \
                                                             style='width:" + tableData[j].progressValue + "%;' \
                                                             aria-valuenow='" + tableData[j].progressValue + "' aria-valuemin='0' aria-valuemax='100'> " + tableData[j].progressValue + "% </div></div></div ></div >" +
                                                            "<div class='row'><div class='col-sm-2'></div><div class='col-sm-2'>" +
                                                            "<button class='button' " + isdisable + " style='color:blue;border:none;background-color:inherit;font-size:15px;font-weight:bold;' title='Work Update'" +
                                                            "onclick='DashboardHelper.UpdateStatusFromDiv(\"" + tableData[j].project + "\",\"" + tableData[j].rowId + "\",\"" + tableData[j].comcId + "\",\"" + tableData[j].progressValue + "\")'><i class='fa fa-building-o'></i></button></div>" +
                                                            "<div class='col-sm-2'>" +
                                                            "<button class='button' style='color:blue;border:none;background-color:inherit;font-size:15px;font-weight:bold;' title='Massages'" +
                                                            "onclick='DashboardHelper.SetMessagesFromDiv(\"" + tableData[j].project + "\",\"" + tableData[j].comcId + "\")'><i class='fa fa-comments-o'></i></button></div>" +
                                                            "<div class='col-sm-2'>" +
                                                            "<button class='button' style='color:blue;border:none;background-color:inherit;font-size:15px;font-weight:bold;' title='View Attachment'" +
                                                            "onclick='DashboardHelper.GetDetailsByCellId(\"" + tableData[j].categoryId + "\",\"" + tableData[j].subCategoryId + "\",\"" + tableData[j].mapCoulmnId + "\",\"" + tableData[j].mapRowId + "\",\"" + tableData[j].rowId + "\",\"Attachment\"\)'><i class='fa fa-paperclip'></i></button></div>" +
                                                            "<div class='col-sm-2'>" +
                                                            "<button class='button' style='color:blue;border:none;background-color:inherit;font-size:15px;font-weight:bold;' title='View History'" +
                                                            "onclick='DashboardHelper.GetDetailsByCellId(\"" + tableData[j].categoryId + "\",\"" + tableData[j].subCategoryId + "\",\"" + tableData[j].mapCoulmnId + "\",\"" + tableData[j].mapRowId + "\",\"" + tableData[j].rowId + "\",\"History\"\)'><i class='fa fa-history'></i></button></div>" +
                                                            "<div class='col-sm-3'></div></div></li> ");
                                                        count++;
                                                    }
                                                }
                                                if (count > 5) {
                                                    // Use 'let' so each iteration keeps its own key
                                                    let currentKey = key;

                                                    $('#' + currentKey).append(
                                                        "<br><div class='row' id='btnMore_" + currentKey + "'>" +
                                                        "<div class='col-sm-12'>" +
                                                        "<center><p><span class='toggle-text' style='color:Blue;font-weight:bold;cursor:pointer;'>Show More . . .</span></p></center>" +
                                                        "</div></div>"
                                                    );

                                                    // Click event for Show More / Less
                                                    $("#btnMore_" + currentKey).on('click', function () {
                                                        $('#' + currentKey + ' .hidden-item').slideToggle();

                                                        //alert('Container ID: ' + currentKey); // ✅ now shows correct ID

                                                        if (currentKey == 'table1')
                                                        {
                                                            window.location.href = "DashboardDetails?ids=110100070002&type=U";

                                                        } else if (currentKey == 'table2')
                                                        {
                                                            window.location.href = "DashboardDetails?ids=110100070002&type=M";

                                                        }
                                                        else if (currentKey == 'table3')
                                                        {
                                                            window.location.href = "DashboardDetails?ids=110100070001";
                                                        }

                                                        var span = $(this).find('.toggle-text');
                                                        if (span.text().includes('More')) {
                                                            span.text('Show Less . . .');
                                                        } else {
                                                            span.text('Show More . . .');
                                                        }
                                                    });
                                                }

                                            }
                                            else {
                                                $('#' + key).append("<li class='myPart'><div class='row'><div class='col-sm-12'><center><p><span style='color:red;'> Nothing To Show !!!</span></p></center></div></div></li>");
                                            }

                                        }
                                    }
                                }
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
    SaveAttachmentData: function () {
        var formData = new FormData();
        formData.append("DESC1", $('#hdnCompanyID').val());
        formData.append("DESC2", $('#hdnRefRowid').val());
        formData.append("DESC3", $('#txtNoteAttachment').val());
        formData.append("DESC4", $('#hdnUserId').val());
        formData.append("DESC5", $('#hdnTermID').val());
        formData.append("DESC8", "Dashboard");
        formData.append("DESC9", $('#cmbStatus').val());
        formData.append("DESC10", $('#txtNoteStatus').val());
        formData.append("DESC11", parseInt($('#myProgressBar').text()));
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
                                $("#modal-Status").modal("hide");
                                DashboardHelper.GetDashboardData($("#hdnUserId").val());
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
    GetDetailsByCellId: function (categoryId, subcategoryId, MapcoulmnId, MaprowId, RefMapRowId, ModalFor) {
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
                                            ActionPlanHelper.GetExecutionDetailsByRowId(id);
                                            $(this).css('background-color', '#D3D3D3');
                                        });

                                        containerExecution.appendChild(divExecution);
                                    });
                                    $("#modal-History").modal("show");
                                }
                                if (ModalFor == "Attachment") {

                                    // File Attachment section
                                    var containerRespons = document.getElementById('divAttachment');
                                    containerRespons.innerHTML = '';
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
                                    $("#modal-Attatchment").modal("show");
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
    scrollToBottom: function () {
        var chatBody = $("#chatMessages");
        chatBody.scrollTop(chatBody.prop("scrollHeight"));
    },
    WorkCompletion: function (Table) {
        console.log(Table);

        var total = 0;
        Table.forEach(function (item) {
            if (item.workStatus == '000000000000') {
                total += item.totalCount; // total count from DB
            }
            
        });

        var container = $("#workStatusContainer");
        container.empty();

        Table.forEach(function (item) {
            var status = item.workStatusName;
            var count = item.totalCount;
            var percentage = Math.round((count / total) * 100);

            var color = "bg-primary";
            if (status.toLowerCase().includes("complete")) color = "bg-success";
            else if (status.toLowerCase().includes("pending")) color = "bg-warning";
            else if (status.toLowerCase().includes("progress")) color = "bg-info";
            else color = "bg-secondary";

            var groupDiv = $("<div>").addClass("progress-group");

            // Status name
            groupDiv.append(status);

            // Count info
            var span = $("<span>")
                .addClass("float-right")
                .html("<b>" + count + "</b>/" + total);
            groupDiv.append(span);

            // Progress bar
            var progress = $("<div>").addClass("progress progress-sm");
            var bar = $("<div>")
                .addClass("progress-bar " + color)
                .css("width", percentage + "%");
            progress.append(bar);

            groupDiv.append(progress);
            container.append(groupDiv);
        });
    },    
    WorkSummary: function (Table) {
        var summaryContainer = document.getElementById("summaryList");
        summaryContainer.innerHTML = "";

        function addInfoBox(name, count, iconClass, pageUrl, bgColor) {
            var colDiv = document.createElement("div");
            colDiv.className = "col-md-4 col-sm-6 col-12 mb-2";

            var div = document.createElement("div");
            div.className = "info-box shadow-sm";
            div.style.borderRadius = "10px";
            div.style.cursor = "pointer";
            div.style.backgroundColor = bgColor;
            div.style.color = "#fff";

            div.innerHTML =
                '<span class="info-box-icon" style="background: rgba(0,0,0,0.2);"><i class="' + iconClass + '"></i></span>' +
                '<div class="info-box-content">' +
                '<span class="info-box-text" style="font-size:20px;">' + name + '</span>' +
                '<span class="info-box-number" style="font-size:20px;">' + count + '</span>' +
                '</div>';

            div.addEventListener('click', function () {
                window.location.href = pageUrl;
            });

            colDiv.appendChild(div);
            summaryContainer.appendChild(colDiv);


        }

        Table.forEach(function (item) {           
            var id = item.workStatus;
            var name = item.workStatusName;
            var count = item.totalCount;
            var icon = "fa fa-tasks";
            var color = "#6c757d";

            if (name.toLowerCase().includes("progress")) color = "#17A2B8"; // blue
            else if (name.toLowerCase().includes("complete")) color = "#28A745"; // green
            else if (name.toLowerCase().includes("all")) color = "#1B47C0"; // dark blue
           
            if (id == "000000000000") addInfoBox(name, count, icon, "DashboardDetails", color);
            else if (id == "110100070002") addInfoBox(name, count, icon, "DashboardDetails?ids=110100070002", color);
            else if (id == "110100070001") addInfoBox(name, count, icon, "DashboardDetails?ids=110100070001", color);

           
        });
    },
    loadDonutChart: function (Table) {

        // Step 1: Prepare chart data dynamically from SQL summary
        const labels = [];
        const values = [];
        const colors = [];
        const hoverColors = [];

        Table.forEach(function (item) {
            labels.push(item.workStatusName);
            values.push(item.totalCount);

            // Dynamic color based on status name
            if (item.workStatusName.toLowerCase().includes("complete")) {
                colors.push("#28A745"); // green
                hoverColors.push("#218838");
            } else if (item.workStatusName.toLowerCase().includes("progress") || item.workStatusName.toLowerCase().includes("pending")) {
                colors.push("#17A2B8"); // blue
                hoverColors.push("#138496");
            } else if (item.workStatusName.toLowerCase().includes("all")) {
                colors.push("#FFC107"); // yellow
                hoverColors.push("#FFB300");
            } else {
                colors.push("#6c757d"); // gray fallback
                hoverColors.push("#5a6268");
            }
        });

        const data = {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                hoverBackgroundColor: hoverColors
            }]
        };

        const ctx = document.getElementById('donutChart').getContext('2d');

        // Step 2: Destroy previous chart if exists (avoid duplicate)
        if (window.donutChartInstance) {
            window.donutChartInstance.destroy();
        }

        // Step 3: Create new Donut Chart
        window.donutChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#000',
                            font: { size: 14 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.raw;
                            }
                        }
                    }
                }
            }
        });
    },
    updateProgress: function () {
        const bar = document.getElementById('myProgressBar');
        bar.style.width = progress + '%';
        bar.innerText = progress + '%';
        bar.setAttribute('aria-valuenow', progress);


    },
    incrementProgress: function () {
        if (progress < 100) {
            progress += 10; // increment 10%
            DashboardHelper.updateProgress();

            if (parseInt($('#myProgressBar').text()) == 100) {
                $("#cmbStatus").val("110100070001").trigger("change");
            }

        }
    },
    decrementProgress: function () {
        if (progress > 0) {
            progress -= 10; // decrement 10%
            DashboardHelper.updateProgress();

        }
        if (parseInt($('#myProgressBar').text()) <= 100) {
            $("#cmbStatus").prop("selectedIndex", 0).select2();
        }
    }
};