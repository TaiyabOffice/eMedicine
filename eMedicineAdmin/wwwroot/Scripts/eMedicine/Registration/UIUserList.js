let rowId = "";
$(document).ready(function () {
  
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
                { data: 'phoneNumber' },
                { data: 'userName' },
                { data: 'email' },
                { data: 'phoneNumber' },
                { data: 'districtName' },
                { data: 'upazilasName' },               
                { data: 'isActive' },
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
                        return '<select id="CmbIsActive_' + meta.row + '" name="CmbIsActive" class="form-control input-sm">' +
                            '<option value="1" ' + (row.isActive === '1' ? 'selected' : '') + '>Yes</option>' +
                            '<option value="0" ' + (row.isActive === '0' ? 'selected' : '') + '>No</option>' +
                            '</select>';
                    }
                },
                { "className": "dt-center", "targets": [] },
                { "className": "dt-left", "targets": [] },

            ]


        });

    },  
    GetAllUser: function ()
    {
        var serviceUrl = "/Registration/GetAllUser";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result)
            {              
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
                console.log(data)
                if (data.status) {
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
};