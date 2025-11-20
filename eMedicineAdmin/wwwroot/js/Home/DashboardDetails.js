var rowId = "", users = [], ids = "", type = "";
let progress = 0; // initial value
// initial value
$(function () {
    $(".select2").select2();
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });
    $(document).ready(function () {
       
        DetailsHelper.GenerateCombo($("#cmbStatus"), "SP_SELECT_DROPDOWN", "GETCOMPLETIONTYPEDESHBOARD", "", "", "", "", "");
        DetailsHelper.BuildtblDashboard();


        var urlParams = new URLSearchParams(window.location.search);
        ids = urlParams.get('ids');
        type = urlParams.get('type');
        DetailsHelper.GetDashboardData(ids, type);
        //console.log(ids, type);
        if (ids == null && type == null) {
            $('#lblPageHeader').html(" All Task List");
        }
        else if (ids == "110100070002" && type == null) {
            $('#lblPageHeader').html("In Progress Work List");
        }
        else if (ids == "110100070001" && type == null) {
            $('#lblPageHeader').html("Completed Work List");
        }
        else if (ids == "110100070002" && type == "U") {
            $('#lblPageHeader').html("Upcomming Work List");
        }
        else if (ids == "110100070002" && type == "M") {
            $('#lblPageHeader').html("Missed Work List");
        } 
    });
    $('#btnSend').click(function () {
        var text = $('#txtMessage').val().trim();
        if (text === '') return;
        DetailsHelper.SendConversationData(text);
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
        DetailsHelper.SaveAttachmentData();
    });

    var $input = $('#txtMessage');

    $input.autocomplete({
        source: [],
        minLength: 0,
        focus: function (event, ui) {
            event.preventDefault();
        },
        select: function (event, ui) {
            let val = $(this).val();
            let newVal = val.replace(/@\w*$/, '@' + ui.item.label + ' ');
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
    $("#cmbStatus").change(function () {
        if ($("#cmbStatus").val() == "110100070001" || $("#cmbStatus").val() == "110100070004" || $("#cmbStatus").val() == "110100070006" || $("#cmbStatus").val() == "110100070007") {
            progress = 100;
        }        

        $('#myProgressBar')
            .css('width', progress + '%')
            .attr('aria-valuenow', progress)
            .text(progress + '%');

    });

    $("#btnMail").click(function () {
        $("#txtMailTo").val("");
        $("#txtCC").val("");
        $("#modal-SendOnMail").modal('show');
    });
    $("#btnSendMail").click(function () {
        if ($("#txtMailTo").val() == "") {
            swal({
                title: "Empty !!!",
                text: "Please Enter To.",
                type: "error",
                timer: 2000,
                closeOnConfirm: false
            });
            return;
        } else {
            var str = $("#txtMailTo").val();
            var array = str.split(';');
            var arrysize = array.length;
            var count = 0;
            for (var i = 0; i < array.length; i++) {
                var email = array[i].replace(/^\s+|\s+$/gm, '');
                if (email == "") {
                    count++
                }
            }
            if (arrysize == count) {
                swal({
                    title: "Sorry !!!",
                    text: "Please Enter Proper To.",
                    type: "error",
                    timer: 2000,
                    closeOnConfirm: false
                });
                return;
            }
        }
        if ($("#txtCC").val() != "") {
            var str = $("#txtCC").val();
            var array = str.split(';');
            var arrysize = array.length;
            var count = 0;
            for (var i = 0; i < array.length; i++) {
                var email = array[i].replace(/^\s+|\s+$/gm, '');
                if (email == "") {
                    count++
                }
            }
            if (arrysize == count) {
                swal({
                    title: "Sorry !!!",
                    text: "Please Enter Proper CC.",
                    type: "error",
                    timer: 2000,
                    closeOnConfirm: false
                });
                return;
            }
        }
        if (DetailsHelper.validateEmail($("#txtMailTo").val()) && DetailsHelper.validateEmail($("#txtCC").val())) {
            swal({
                title: "Sending ...",
                text: "Please wait",
                showConfirmButton: false,
                allowOutsideClick: false,
            });
            swal({
                title: "Are You Sure ?",
                text: "",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                setTimeout(function () {
                    DetailsHelper.MailFile();
                });
            });
        }
    });
    $("#btnbackPage2").click(function () {
        window.location.href = "/home/Dashboard";
    });
});

var DetailsHelper = {
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
                                DetailsHelper.loadConversation($('#hdnCompanyID').val());
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
    BuildtblDashboard: function (tbldata) {
        $('#tblDashboard').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            "order": false,
           
            "columns": [
                { "data": null },
                { "data": null },
                { "data": "comcId" },
                { "data": "categoryId" },
                { "data": "subCategoryId" },
                { "data": "mapCoulmnId" },
                { "data": "coulmnGroupId" },
                { "data": "mapRowId" },
                { "data": "project" },
                { "data": "catagoryName" },
                { "data": "subCatagoryName" },
                { "data": "coulmnName" },
                { "data": "coulmnGroupName" },
                { "data": "rowName" },
                { "data": "catSubcatName" },
                { "data": "coulmnRowName" },
                { "data": "cellValue" },
                { "data": "rowId" },
                { "data": "workStatusName" },
                { "data": "attachmentnumber" },
                { "data": "progressValue" },
                { "data": "workStatus" }, //21
            ],
            "columnDefs": [
                {
                    "targets": [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 17, 19, 21],
                    "visible": false
                },
                {
                    "targets": [15],
                    "render": function (data, type, row, meta) {
                        if (parseFloat(row.attachmentnumber) > 0) {
                            return '<button type="button" style="color:blue;border:none;background-color:inherit;font-size:14px;font-weight:bold;" title="Work History" onclick="DetailsHelper.GetDetailsByCellId(\'' + row.categoryId + '\',\'' + row.subCategoryId + '\',\'' + row.mapCoulmnId + '\',\'' + row.mapRowId + '\',\'' + row.rowId + '\',\'Attachment\'\)"><i class="fa fa-paperclip"></i></button>  ' + data;
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    "targets": [16],
                    "render": function (data, type, row, meta) {
                        return '<button type="button" style="color:blue;border:none;background-color:inherit;font-size:10px;font-weight:bold;" title="Work History" onclick="DetailsHelper.GetDetailsByCellId(\'' + row.categoryId + '\',\'' + row.subCategoryId + '\',\'' + row.mapCoulmnId + '\',\'' + row.mapRowId + '\',\'' + row.rowId + '\',\'History\'\)">' + data + '</button>';
                    }
                },
                {
                    "targets": [0],
                    "width": "2%",
                    "class": "dt-right",
                    "render": function (data, type, row, meta) {
                        var isdisable = "";
                        if (row.workStatusName === "Completed" || row.workStatusName === "Done" || row.workStatusName === "Found" || row.workStatusName === "Arrived") {
                            isdisable = "hidden";
                        } else {
                            isdisable = "";
                        }
                        return '<button type="button"' + isdisable + ' style="color:blue;text-decoration:underline;border:none;background-color:inherit;font-size:13px;font-weight:bold;" title="Work Update" onclick="DetailsHelper.UpdateStatus(' + meta.row + ')"><i class="fa fa-building-o"></i></button>';
                    }
                },
                {
                    "targets": [20],
                    "width": "2%",
                    "class": "dt-right",
                    "render": function (data, type, row, meta) {
                        return '<div id="progress_' + row.id + '" class="progress">' +
                            '<div class="progress-bar" role="progressbar" style="width:' + row.progressValue + '%;" aria-valuenow="' + row.progressValue + '" aria-valuemin="0" aria-valuemax="100">' +
                            row.progressValue + '%' +
                            '</div>' +
                            '</div>';
                    }
                },
                {
                    "targets": [1],
                    "width": "2%",
                    "class": "dt-right",
                    "render": function (data, type, row, meta) {

                        return '<button type="button"  style="color:blue;text-decoration:underline;border:none;background-color:inherit;font-size:13px;font-weight:bold;" title="Massages" onclick="DetailsHelper.SetMessages(' + meta.row + ')"><i class="fa fa-comments"></i></button>';
                    }
                },
            ]
        });
    },
    UpdateStatus: function (rid) {
        $('#hdnCompanyID').val("");
        $('#hdnRefRowid').val("");
        //$("#cmbStatus").prop("selectedIndex", 0).select2();
        

        rowId = rid;
        var table = $("#tblDashboard").DataTable();
        $("#lblStatus").html("Update Status for " + table.cell(rid, 8).data());
        $('#hdnCompanyID').val(table.cell(rid, 2).data());
        $('#hdnRefRowid').val(table.cell(rid, 17).data());
        progress = parseInt(table.cell(rid, 20).data());
        $('#myProgressBar')
            .css('width', table.cell(rid, 20).data() + '%')
            .attr('aria-valuenow', table.cell(rid, 20).data())
            .text(table.cell(rid, 20).data() + '%');
        $("#cmbStatus").val(table.cell(rid, 21).data()).trigger("change");
        
        //progressVal = table.cell(rid, 20).data();
        $("#modal-Status").modal("show");
    },
    SetMessages: function (rid) {
        $('#hdnCompanyID').val("");
        $('#hdnRefRowid').val("");
        rowId = rid;

        var table = $("#tblDashboard").DataTable();
        $("#chatUserName").html("Conversation for " + table.cell(rid, 8).data());

        $('#hdnCompanyID').val(table.cell(rid, 2).data());
        DetailsHelper.loadConversation($('#hdnCompanyID').val());
    },
    SetMessagesFromDiv: function (Label, Companyid) {
        $('#hdnCompanyID').val("");
        $('#hdnRefRowid').val("");
        $("#chatUserName").html("Conversation for " + Label);
        $('#hdnCompanyID').val(Companyid);
        DetailsHelper.loadConversation($('#hdnCompanyID').val());
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
                                DetailsHelper.scrollToBottom();
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
    GetDashboardData: function (ids, type) {
        $.getJSON("../Home/SessionCheck")
            .done(function (data) {
                if (data.success) {
                    location.reload();
                    return;
                } else {
                    var obj = {
                        DESC1: $("#hdnUserId").val(),
                        DESC2: ids,
                        DESC3: type,
                    };

                    $.ajax({
                        url: ApiLink.GetDashboardData,
                        type: "GET",
                        contentType: 'application/json',
                        data: obj,
                        success: function (data) {
                            if (data.success) {
                                $("#item").empty();

                                DetailsHelper.BuildtblDashboard(data.data.ds.table);
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
                                var urlParams = new URLSearchParams(window.location.search);
                                var ids = urlParams.get('ids');
                                DetailsHelper.GetDashboardData(ids);
                                
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
                                                var fileUrl = ApiLink.BaseUrl + row.filePath;  // <-- শুধু এখানে তোমার API base URL দাও

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
    updateProgress: function () {
        const bar = document.getElementById('myProgressBar');
        bar.style.width = progress + '%';
        bar.innerText = progress + '%';
        bar.setAttribute('aria-valuenow', progress);


    },
    incrementProgress: function () {
        if (progress < 100) {
            progress += 10; // increment 10%
            DetailsHelper.updateProgress();

            if (parseInt($('#myProgressBar').text()) == 100) {
                $("#cmbStatus").val("110100070001").trigger("change");
            }

        }
    },
    decrementProgress: function () {
        if (progress > 0) {
            progress -= 10; // decrement 10%
            DetailsHelper.updateProgress();

        }
        if (parseInt($('#myProgressBar').text()) <= 100) {
            $("#cmbStatus").prop("selectedIndex", 0).select2();
        }
    },

    validateEmail: function (str) {
        var emailRegEx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var array = str.split(';');
        for (var i = 0; i < array.length; i++) {
            var email = array[i].replace(/^\s+|\s+$/gm, '');
            if (email != "") {
                if (!email.match(emailRegEx)) {
                    swal({
                        title: "Sorry !!!",
                        text: 'The email address ' + ' "' + email + '" ' + ' is invalid',
                        type: "error",
                        timer: 2000,
                        closeOnConfirm: false
                    });
                    return false;
                }
            }
        }
        return true;
    },

    MailFile: function () {
        var jsonParam = { toMail: $("#txtMailTo").val(), ccMail: $("#txtCC").val(), DESC1: $("#hdnUserId").val(), DESC2: ids, DESC3: type };
        var serviceUrl = "/Home/SendMailByButton/";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (data) {
                if (data.message=="1") {
                    swal({
                        title: "Congratulations !!!",
                        text: "Mail Send",
                        type: "success",
                        closeOnConfirm: false
                    });
                    $("#modal-SendOnMail").modal('hide');
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Something went wrong !!!",
                        type: "info",
                        closeOnConfirm: false
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
    },
};