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
        var UserPassword = $("#txtPassword").val();

        var json = { UserName: UserName, Password: UserPassword };

        $.ajax({
            type: "POST",
            url: "/LogIn/LogIn",
            data: JSON.stringify(json),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    $("body").removeClass("loading");
                    window.location.href = '/DashBoard/Dashboard';
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Your action was successful.',
                        timer: 1000
                    });
                }
                else {
                    $("body").removeClass("loading");
                    $("#lblMessage").html("Invalid Username or Password");
                    $("#btnLogin").show();
                }
            },
            error: function (data) {
                $("body").removeClass("loading");
                $("#lblMessage").html("Something Went Wrong !!!");
                $("#btnLogin").show();
            }
        });
    }
};

