$(document).ready(function () {
    $("#txtUserName").on("keydown", function (e) {
        if (e.keyCode == 13) {
            $("#txtPassword").focus();
        }
    });

    $("#txtPassword").on("keydown", function (e) {
        if (e.keyCode == 13) {
            $("#btnLogin").click();
        }
    });

    $("#btnLogin").on("keydown", function (e) {
        if (e.keyCode == 13) {
            $("#btnLogin").click();
        }
    });

    $("#btnLogin").click(function () {
        $("#btnLogin").hide();
        $("body").addClass("loading");
        LoginHelper.LogInData();
    });

    $("#txtUserName").click(function () {
        $("#lblMessage").val("");
    });
});


var LoginHelper = {
    ShowPassword: function (a, clr) {
        var x = document.getElementById(a);
        var c = clr; //x.nextElementSibling;
        if (x.getAttribute('type') == "password") {
            c.removeAttribute("class");
            c.setAttribute("class", "fa fa-eye field-icon2");
            x.removeAttribute("type");
            x.setAttribute("type", "text");
        } else {
            x.removeAttribute("type");
            x.setAttribute('type', 'password');
            c.removeAttribute("class");
            c.setAttribute("class", "fa fa-eye-slash field-icon2");
        }
    },

    LogInData: function () {
        var UserName = $("#txtUserName").val();
        var Password = $("#txtPassword").val();
        if (Password == null || Password == "") {
            $("#lblMessage").html("Please Enter Password.");
            $("#btnLogin").show();
            $("body").removeClass("loading");
            return;
        }
        var Param = { UserName: UserName, Password: Password };
        jQuery.ajax({
            type: "POST",
            url: "/LogIn/LoginData",
            data: Param,
            success: function (data) {
                if (data.success) {
                    $("body").removeClass("loading");
                    window.location.href = '/Dashboard/Dashboard';
                }
                else {
                    $("body").removeClass("loading");
                    $("#lblMessage").html("Invalid Username or Password");
                    swal({
                        title: "Sorry",
                        text: "Invalid Username or Password",
                        type: "warning",
                        closeOnConfirm: false,
                        allowOutsideClick: false,
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
    }
};