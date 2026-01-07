$(function () {

    $(".select2").select2();

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
    };

    $("#txtloginId").on("change", function (e) {
        ChangeProfileHelper.CheckUserId();
    });

    $("#txtloginId").on("keydown", function (e) {
        if (e.keyCode == 13) {
            $("#txtoldpassword").focus();
        }
    });

    $("#txtoldpassword").on("keydown", function (e) {
        if (e.keyCode == 13) {
            $("#txtpassword").focus();
        }
    });

    $("#txtpassword").on("keydown", function (e) {
        if (e.keyCode == 13) {
            $("#txtconpassword").focus();
        }
    });

    $("#btnSave").click(function () {
        swal({
            title: "Are you sure?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    ChangeProfileHelper.SaveData();
                } else {
                    swal("Cancelled", "Save Cancellation", "error");
                }
            });
    });

    $("#btnNew").click(function () {
        window.location.href = $(location).attr("pathname");
    });

});

var ChangeProfileHelper = {
    ShowPassword: function (a, clr) {
        var x = document.getElementById(a);
        var c = clr; //x.nextElementSibling;
        if (x.getAttribute('type') == "password") {
            c.removeAttribute("class");
            c.setAttribute("class", "fa fa-eye fa-lg");
            x.removeAttribute("type");
            x.setAttribute("type", "text");
        } else {
            x.removeAttribute("type");
            x.setAttribute('type', 'password');
            c.removeAttribute("class");
            c.setAttribute("class", "fa fa-eye-slash fa-lg");
        }
    },
    SaveData: function () {
        var UsrOldPass = $("#txtoldpassword").val();
        var UsrPass = $("#txtpassword").val();
        var ConUsrPass = $("#txtconpassword").val();
        var UsrSname = $("#txtloginId").val();

        if (UsrSname.length === 0) {
            swal({
                title: "Sorry!",
                text: "Please Enter User Login ID",
                type: "error",
                closeOnConfirm: false
            });

            $("#txtloginId").focus();
            return;
        }


        if (UsrOldPass.length === 0) {
            swal({
                title: "Sorry!",
                text: "Please Enter Old Password",
                type: "error",
                closeOnConfirm: false
            });

            $("#txtoldpassword").focus();
            return;
        }

        if (UsrPass.length === 0) {
            swal({
                title: "Sorry!",
                text: "Please Enter Password",
                type: "error",
                closeOnConfirm: false
            });

            $("#txtpassword").focus();
            return;
        }

        if (UsrPass !== ConUsrPass) {
            swal({
                title: "Sorry!",
                text: "Password Not Match. Please Check Password.",
                type: "error",
                closeOnConfirm: false
            });

            $("#txtpassword").focus();
            return;
        }
        
        var jsonParam = {DESC1: $("#txtloginId").val(),DESC2: $("#txtoldpassword").val(),DESC3: $("#txtpassword").val()};

        $.ajax({
            url: ApiLink.ChangePassword,
            type: "POST",
            data: jsonParam,
            dataType: "json",
            success: function (data) {
                if (data.Table) {
                    if (data.Table[0].CK === "1") {
                        swal({
                            title: "Congratulation!!",
                            text: "Password Change Successfully",
                            type: "success",
                            timer: 2000
                        });
                        $("#txtoldpassword").val("");
                        $("#txtpassword").val("");
                        $("#txtconpassword").val("");
                    } else {
                        swal({
                            title: "Sorry!",
                            text: "Old Password Does Not Match. Please Try Again!!!!!!",
                            type: "error",
                            closeOnConfirm: false
                        });
                    }
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Record Not Update Properly. Please Try Again!!!!!!",
                        type: "error",
                        closeOnConfirm: false
                    });
                }
            }
        });
    },
}