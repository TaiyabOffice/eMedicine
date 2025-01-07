var dataSet = [];




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

        var json = { UserName: UserName, UserPassword: UserPassword };

        $.ajax({
            type: "POST",
            url: "/LogIn/LogIn", // Adjust the URL if needed based on your routing setup
            data: JSON.stringify(json), // Send data as JSON
            contentType: "application/json; charset=utf-8", // Specify the content type
            dataType: "json", // Expect a JSON response
            success: function (data) {
                if (data.success) {
                    $("body").removeClass("loading");                   
                    window.location.href = '/DashBoard/Dashboard';
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

