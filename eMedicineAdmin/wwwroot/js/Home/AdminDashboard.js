var rowId = "", users = [];
$(function () {
    $(".select2").select2();
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });

    $(document).ready(function () {
        AdminHelper.GenerateCombo($("#cmbStatus"), "SP_SELECT_DROPDOWN", "GETALLCODEGROUP", "110100070000", "", "", "", "");
        //AdminHelper.BuildtblDashboard();
        AdminHelper.GetDashboardData($("#hdnUserId").val());

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



        const TableData = [
            { CompanyName: "Aggragati Foundation", UserId: 100470, ParentId: null, UserName: "Mr. Rahman", Designation: "CEO" },
            { CompanyName: "Aggragati Foundation", UserId: 2, ParentId: 100470, UserName: "Mr. Karim", Designation: "Manager" },
            { CompanyName: "Aggragati Foundation", UserId: 3, ParentId: 2, UserName: "Mr. Hasan", Designation: "Officer" },
            { CompanyName: "Aggragati Foundation", UserId: 4, ParentId: 2, UserName: "Mr. Rafi", Designation: "Officer" },
            { CompanyName: "Aggragati Foundation", UserId: 5, ParentId: 2, UserName: "Mr. Rafiq", Designation: "Officer" },
            { CompanyName: "Aggragati Foundation", UserId: 6, ParentId: 3, UserName: "Mr. Hasan", Designation: "Officer" },
            { CompanyName: "Aggragati Foundation", UserId: 6, ParentId: 3, UserName: "Mr. Rafi", Designation: "Officer" },
            { CompanyName: "Aggragati Foundation", UserId: 6, ParentId: 3, UserName: "Mr. Rafiq", Designation: "Officer" },

            { CompanyName: "TechGrow Ltd", UserId: 10, ParentId: null, UserName: "Mrs. Akter", Designation: "Director" },
            { CompanyName: "TechGrow Ltd", UserId: 11, ParentId: 10, UserName: "Mr. Nayeem", Designation: "Developer" },

            { CompanyName: "SoftEdge IT", UserId: 20, ParentId: null, UserName: "Mr. Habib", Designation: "CTO" },
            { CompanyName: "SoftEdge IT", UserId: 21, ParentId: 20, UserName: "Mr. Saad", Designation: "Engineer" },

            { CompanyName: "Green Agro Ltd1", UserId: 30, ParentId: null, UserName: "Mr. Faisal", Designation: "Chairman" },
            { CompanyName: "Green Agro Ltd1", UserId: 31, ParentId: 30, UserName: "Mr. Monir", Designation: "Supervisor" },

             { CompanyName: "Green Agro Ltd2", UserId: 30, ParentId: null, UserName: "Mr. Faisal", Designation: "Chairman" },
            { CompanyName: "Green Agro Ltd2", UserId: 31, ParentId: 30, UserName: "Mr. Monir", Designation: "Supervisor" },

             { CompanyName: "Green Agro Ltd3", UserId: 30, ParentId: null, UserName: "Mr. Faisal", Designation: "Chairman" },
            { CompanyName: "Green Agro Ltd3", UserId: 31, ParentId: 30, UserName: "Mr. Monir", Designation: "Supervisor" },

             { CompanyName: "Green Agro Ltd4", UserId: 30, ParentId: null, UserName: "Mr. Faisal", Designation: "Chairman" },
            { CompanyName: "Green Agro Ltd4", UserId: 31, ParentId: 30, UserName: "Mr. Monir", Designation: "Supervisor" },
        ];

        AdminHelper.buildAllOrganograms(TableData);
    });
    $('#btnSend').click(function () {
        var text = $('#txtMessage').val().trim();
        if (text === '') return;
        AdminHelper.SendConversationData(text);
        $('#txtMessage').val("");
    });
    $("#btnSubAttachment").click(function () {
        AdminHelper.SaveAttachmentData();
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

});

var AdminHelper = {
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
                                AdminHelper.loadConversation($('#hdnCompanyID').val());
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
    UpdateStatus: function (rid) {
        $('#hdnCompanyID').val("");
        $('#hdnRefRowid').val("");
        rowId = rid;
        var table = $("#tblDashboard").DataTable();
        $("#lblStatus").html("Update Status for " + table.cell(rid, 8).data());
        $('#hdnCompanyID').val(table.cell(rid, 2).data());
        $('#hdnRefRowid').val(table.cell(rid, 17).data());
        $("#modal-Status").modal("show");
    },
    UpdateStatusFromDiv: function (Label, RefRowId, Companyid,) {
        $('#hdnCompanyID').val("");
        $('#hdnRefRowid').val("");
        $("#lblStatus").html("Update Status for " + Label);
        $('#hdnCompanyID').val(Companyid);
        $('#hdnRefRowid').val(RefRowId);
        $("#modal-Status").modal("show");
    },
    SetMessages: function (rid) {
        $('#hdnCompanyID').val("");
        $('#hdnRefRowid').val("");
        rowId = rid;
        var table = $("#tblDashboard").DataTable();
        $("#chatUserName").html("Conversation for " + table.cell(rid, 8).data());
        $('#hdnCompanyID').val(table.cell(rid, 2).data());
        AdminHelper.loadConversation($('#hdnCompanyID').val());
    },
    SetMessagesFromDiv: function (Label, Companyid) {
        $('#hdnCompanyID').val("");
        $('#hdnRefRowid').val("");
        $("#chatUserName").html("Conversation for " + Label);
        $('#hdnCompanyID').val(Companyid);
        AdminHelper.loadConversation($('#hdnCompanyID').val());
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
                                AdminHelper.scrollToBottom();
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

                                //AdminHelper.BuildtblDashboard(data.data.ds.table);

                                AdminHelper.WorkCompletion(data.data.ds.table);
                                AdminHelper.WorkSummary(data.data.ds.table);
                                AdminHelper.loadDonutChart(data.data.ds.table);
                                var ds = data.data.ds;
                                for (var key in ds) {
                                    if (ds.hasOwnProperty(key)) {
                                        var tableData = ds[key];
                                        if (key != "table") {
                                            $('#item').append("<div class='col-lg-4 col-xs-6 myItem' style ='cursor: pointer;'><div style='background-color:" + tableData[0].refName + "'><div class='inner' style='margin:5px;padding:5px;'>" +
                                                "<center><h3 style='font-size:20px'>" + tableData[0].title + "</h3></center><ul class='col-md-12' id='" + key + "' style='position: static;list-style-type: none;min-height:100px;'></ul></div><div class='icon'></div>" +
                                                "</div></div>");

                                            if (tableData.length > 1) {
                                                var count = 0;
                                                var isdisable = "";
                                                for (var j = 0; j < tableData.length; j++) {
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
                                                            "<div class='row'><div class='col-sm-2'></div><div class='col-sm-2'>" +
                                                            "<button class='button' " + isdisable + " style='color:blue;border:none;background-color:inherit;font-size:15px;font-weight:bold;' title='Work Update'" +
                                                            "onclick='AdminHelper.UpdateStatusFromDiv(\"" + tableData[j].project + "\",\"" + tableData[j].rowId + "\",\"" + tableData[j].comcId + "\")'><i class='fa fa-building-o'></i></button></div>" +
                                                            "<div class='col-sm-2'>" +
                                                            "<button class='button' style='color:blue;border:none;background-color:inherit;font-size:15px;font-weight:bold;' title='Massages'" +
                                                            "onclick='AdminHelper.SetMessagesFromDiv(\"" + tableData[j].project + "\",\"" + tableData[j].comcId + "\")'><i class='fa fa-comments-o'></i></button></div>" +
                                                            "<div class='col-sm-2'>" +
                                                            "<button class='button' style='color:blue;border:none;background-color:inherit;font-size:15px;font-weight:bold;' title='View Attachment'" +
                                                            "onclick='AdminHelper.GetDetailsByCellId(\"" + tableData[j].categoryId + "\",\"" + tableData[j].subCategoryId + "\",\"" + tableData[j].mapCoulmnId + "\",\"" + tableData[j].mapRowId + "\",\"" + tableData[j].rowId + "\",\"Attachment\"\)'><i class='fa fa-paperclip'></i></button></div>" +
                                                            "<div class='col-sm-2'>" +
                                                            "<button class='button' style='color:blue;border:none;background-color:inherit;font-size:15px;font-weight:bold;' title='View History'" +
                                                            "onclick='AdminHelper.GetDetailsByCellId(\"" + tableData[j].categoryId + "\",\"" + tableData[j].subCategoryId + "\",\"" + tableData[j].mapCoulmnId + "\",\"" + tableData[j].mapRowId + "\",\"" + tableData[j].rowId + "\",\"History\"\)'><i class='fa fa-history'></i></button></div>" +
                                                            "<div class='col-sm-3'></div></div></li> ");
                                                        count++;
                                                    }
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
                                AdminHelper.GetDashboardData();
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
                                        if (row.attachmentName != "") {
                                            var divAttachment = document.createElement('div');
                                            divAttachment.className = 'item-box';
                                            divAttachment.setAttribute('data-id', row.rowId);
                                            var html =
                                                '<b style="color:Green; font-size:15px;">' + row.attachmentName + '</b>' +
                                                '<b class="pull-right">' + row.rowDate + '</b><br>' +
                                                'Note: ' + row.note + '<br>';

                                            if (row.filePath && row.filePath.trim() !== "") {
                                                var fileUrl = 'http://192.168.100.79:45455/' + row.filePath;  // <-- শুধু এখানে তোমার API base URL দাও

                                                html += '<a href="' + fileUrl + '" target="_blank" download ' +
                                                    'class="btn btn-sm btn-outline-primary mt-2">⬇ Download File</a>';
                                            }

                                            divAttachment.innerHTML = html;
                                            containerRespons.appendChild(divAttachment);
                                        }
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
        var grouped = {};
        Table.forEach(function (item) {
            if (!grouped[item.workStatusName]) grouped[item.workStatusName] = 0;
            grouped[item.workStatusName]++;
        });

        var total = Table.length;
        var container = $("#workStatusContainer");
        container.empty();
        $.each(grouped, function (status, count) {
            var percentage = Math.round((count / total) * 100);
            var color = "bg-primary";
            if (status.toLowerCase().includes("complete")) color = "bg-success";
            else if (status.toLowerCase().includes("pending")) color = "bg-warning";
            else if (status.toLowerCase().includes("progress")) color = "bg-info";
            else color = "bg-secondary";

            var groupDiv = $("<div>").addClass("progress-group");

            groupDiv.append(status);
            var span = $("<span>")
                .addClass("float-right")
                .html("<b>" + count + "</b>/" + total);
            groupDiv.append(span);

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
        var uniqueProjects = new Set();
        var taskIds = new Set();
        var completedProjectIds = new Set();
        var pendingProjectIds = new Set();
        var completedCount = 0;
        var pendingCount = 0;
        var totalTask = 0;


        Table.forEach(function (item) {
            if (item.comcId) uniqueProjects.add(item.comcId);
            if (item.coulmnRowName) taskIds.add(item.coulmnRowName);
            if (item.workStatus === "110100070001" || item.workStatus === "110100070006") {
                completedProjectIds.add("110100070001");
                completedCount++;
            }
            if (item.workStatus === "110100070002") {
                pendingProjectIds.add(item.workStatus);
                pendingCount++;
            }
            totalTask++;
        });

        var summaryContainer = document.getElementById("summaryList");
        summaryContainer.innerHTML = ""; // Clear previous content


        function addInfoBox(name, count, iconClass, pageUrl, ids, bgColor) {
            var colDiv = document.createElement("div");
            colDiv.className = "col-md-4 col-sm-6 col-12 mb-2";

            var div = document.createElement("div");
            div.className = "info-box shadow-sm";
            div.style.borderRadius = "10px";
            div.style.cursor = "pointer";
            div.style.backgroundColor = bgColor; // custom background
            div.style.color = "#fff"; // text color white

            div.innerHTML =
                '<span class="info-box-icon" style="background: rgba(0,0,0,0.2);"><i class="' + iconClass + '"></i></span>' +
                '<div class="info-box-content">' +
                '<span class="info-box-text" style="font-size:20px; font-decoration:bold">' + name + '</span>' +
                '<span class="info-box-number" style="font-size:20px; font-decoration:bold">' + count + '</span>' +
                '</div>';

            div.addEventListener('click', function () {
                if (ids && ids.size > 0) {
                    window.location.href = pageUrl + '?ids=' + Array.from(ids).join(',');
                } else {
                    window.location.href = pageUrl;
                }
            });

            colDiv.appendChild(div);
            summaryContainer.appendChild(colDiv);
        }
        //addInfoBox("All Task", uniqueProjects.size, "fa fa-building-o", "DashboardDetails", "", '#1B47C0'); // Yellow
        addInfoBox("All Task", totalTask, "fa fa-building-o", "DashboardDetails", "", '#1B47C0'); // Yellow
        //addInfoBox("Tasks", taskIds.size, "fa fa-tasks", "DashboardDetails/Tasks", taskIds, '#17A2B8'); // Blue
        addInfoBox("Pending Task", pendingCount, "fa fa-tasks", "DashboardDetails", pendingProjectIds, '#17A2B8'); // Blue
        addInfoBox("Completed Task", completedCount, "fa fa-check-circle", "DashboardDetails", completedProjectIds, '#28A745'); // Green
        //addInfoBox("Completed Projects", completedProjectIds.size, "fa fa-check-circle", "DashboardDetails/CompletedProjects", "", '#28A745'); // Green      
    },
    loadDonutChart: function (Table) {
        var uniqueProjects = new Set();
        var taskIds = new Set();
        var completedProjectIds = new Set();
        var pendingProjectIds = new Set();
        var completedCount = 0;
        var pendingCount = 0;
        var totalTask = 0;

        //Table.forEach(function (item) {
        //    if (item.comcId) uniqueProjects.add(item.comcId);
        //    if (item.coulmnRowName) taskIds.add(item.coulmnRowName);
        //    if (item.workStatus === '110100070001' && item.comcId) completedProjectIds.add(item.comcId);
        //});
        Table.forEach(function (item) {
            if (item.comcId) uniqueProjects.add(item.comcId);
            if (item.coulmnRowName) taskIds.add(item.coulmnRowName);
            if (item.workStatus === "110100070001") {
                completedProjectIds.add(item.workStatus);
                completedCount++;
            }
            if (item.workStatus === "110100070002") {
                pendingProjectIds.add(item.workStatus);
                pendingCount++;
            }
            totalTask++;
        });

        var data = {
            labels: ['All Task', 'Pending Tasks', 'Completed Task'],
            datasets: [{
                //data: [uniqueProjects.size, taskIds.size, completedProjectIds.size],
                data: [totalTask, pendingCount, completedCount],
                backgroundColor: ['#FFC107', '#17A2B8', '#28A745'], // colors
                hoverBackgroundColor: ['#FFB300', '#138496', '#218838']
            }]
        };

        var ctx = document.getElementById('donutChart').getContext('2d');

        // Destroy previous chart instance if exists to avoid duplicates
        if (window.donutChartInstance) {
            window.donutChartInstance.destroy();
        }

        window.donutChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
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

    buildAllOrganograms: function (data) {
        // Group by company
        const companies = {};
        data.forEach(item => {
            if (!companies[item.CompanyName]) companies[item.CompanyName] = [];
            companies[item.CompanyName].push(item);
        });

        let html = '<div class="row">';
        let count = 0;

        Object.keys(companies).forEach(company => {
            if (count % 4 === 0 && count !== 0) html += '</div><div class="row">';
            html += `
        <div class="col-md-3">
            <div class="org-box">
                <div class="org-header">${company}</div>
                <div class="org-body">
                    ${AdminHelper.buildOrganogramTree(companies[company], null)}
                </div>
            </div>
        </div>`;
            count++;
        });

        html += '</div>';
        $("#orgMainContainer").html(html);

        // Click event attach after render
        document.querySelectorAll('.org-node').forEach(node => {
            node.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                //alert('Clicked ID: ' + id);
                AdminHelper.GetDashboardData(id);
            });
        });
    },

    buildOrganogramTree: function (data, parentId) {
        const nodes = data.filter(x => x.ParentId === parentId);
        if (nodes.length === 0) return '';

        let html = '<div class="org-level">';
        nodes.forEach(node => {
            html += `
        <div class="org-node" data-id="${node.UserId}">
            <img src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png" alt="user">
            <div class="org-name">${node.UserName}</div>
            <div class="org-title">${node.Designation}</div>
        </div>
        `;
        });
        html += '</div>';

        nodes.forEach(node => {
            const children = AdminHelper.buildOrganogramTree(data, node.UserId);
            if (children) html += `<div class="org-connector"></div>${children}`;
        });

        return html;
    }



};