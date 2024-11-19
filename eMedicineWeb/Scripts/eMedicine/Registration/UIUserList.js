let rowId = "";
$(document).ready(function () {

    $(".select2").select2();    
    jQuery.ajax({
        url: "/Common/GetCurrentDate",
        type: "POST",
        success: function (result) {
            $("#hdnDateToday").datepicker({ format: "dd-M-yyyy", autoclose: true });
            $("#hdnDateToday").datepicker('setDate', new Date(result));
        }
    });
    UserHelper.BuildTbl("");
    UserHelper.GetAllUser();
});

$("#btnClear").click(function (event) {
    event.preventDefault();
    location.reload();
});

var UserHelper = {
    GenerateCombo: function (objcmb, proName, callName, param1, param2, param3, param4, param5) {

        objcmb.empty();
        var json = { ProcedureName: proName, CallName: callName, Param1: param1, Param2: param2, Param3: param3, Param4: param4, Param5: param5 };
        jQuery.ajax({
            type: "POST",
            url: "/Common/GenerateCombo",
            data: json,
            success: function (data) {
                if (data.data.length == 1) {
                    $.each(data.data, function (key, item) {
                        objcmb.append($("<option></option>").attr("value", item.Id).text(item.Name));
                    });
                }
                else {
                    objcmb.append($("<option></option>").attr("value", "").text("-Select-"));
                    $.each(data.data, function (key, item) {
                        objcmb.append($("<option></option>").attr("value", item.Id).text(item.Name));
                    });

                }
                // this is for to work onchange event when only one data is returned
                objcmb.change();
            }
        });
    },
    BuildTbl: function (tbldata) {
        $('#tblUser').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },
                { data: 'PhoneNumber' },
                { data: 'UserName' },
                { data: 'Email' },
                { data: 'PhoneNumber' },
                { data: 'DistrictName' },
                { data: 'UpazilasName' },               
                { data: 'IsActive' },
                {
                    data: null,
                    render: function (data, type, row, meta)
                    {
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="UserHelper.EditByUserID(' + meta.row + ')" class="btn btn-sm btn-danger"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button>';
                    }
                }
            ],
            "columnDefs": [
                {
                    "targets": [0],
                    "width": "2%",
                    render: function (data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1; },
                },
                {
                    targets: [7], // Target the appropriate column index
                    render: function (data, type, row, meta) {  
                        const isActive = row.IsActive || 0;
                        return `
                                <select id="CmbIsActive_${meta.row}" name="CmbIsActive" class="form-control input-sm">
                                    <option value="1" ${row.IsActive === '1' ? 'selected' : ''}>Yes</option>
                                    <option value="0" ${row.IsActive === '0' ? 'selected' : ''}>No</option>
                                </select>`;
                    }
                },
                { "className": "dt-center", "targets": [] },
                { "className": "dt-left", "targets": [] },

            ]


        });

    },  
    GetAllUser: function () {
        var serviceUrl = "/Registration/GetAllUser";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result) {
                if (result.success) {
                    UserHelper.BuildTbl(result.data);
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving Users.!" + result.message,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "Error retrieving Users.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },


    EditByUserID: function (rowId) {
        var table = $('#tblUser').DataTable();
        var isActive = table.cell(rowId, 7).nodes().to$().find('select').val()        
        var json = { UserId: table.cell(rowId, 1).data(), isActive: isActive };
        jQuery.ajax({
            type: "POST",
            url: "/Registration/UpdateUserById",
            data: json,
            success: function (data) {
                if (data == '1') {
                    $("body").removeClass("loading");
                    swal({
                        title: "Congratulations",
                        text: "Update Successfully",
                        type: "success",
                        showConfirmButton: false,
                        allowOutsideClick: false, 
                        timer: 2000
                    });   
                    UserHelper.GetAllUser();
                }
                else {
                    $("body").removeClass("loading");
                    $("#lblMessage").html("Invalid Username or Password");
                    swal({
                        title: "Sorry",
                        text: "Invalid Username or Password",
                        type: "warning",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        timer: 2000
                    });
                    $("#btnLogin").show();
                }
            },
            error: function (data) {
                $("body").removeClass("loading");
                $("#lblMessage").html("Something Went Wrong !!!");
                swal({
                    title: "Sorry!",
                    text: "Something Went Wrong !!! \n" + data.statusText,
                    type: "error",
                    closeOnConfirm: false
                });
                $("#btnLogin").show();
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
        var caratPos = UserHelper.getSelectionStart(el);
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
};