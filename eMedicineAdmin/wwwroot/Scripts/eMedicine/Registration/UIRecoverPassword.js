$(document).ready(function () {   
    PasswordRecoveryHelper.ValidatePasswordRecovery();

});
$("#btnRecoverPassword").click(function () {
    if ($("#passwordRecoveryForm").valid()) {
        PasswordRecoveryHelper.RecoverPassword();
    }
});

$("#txtPhone, #txtPassword, #txtConfirmPassword").on("keydown", function (e) {
    if (e.keyCode == 13) {
        if ($("#passwordRecoveryForm").valid()) {
            $("#btnRecoverPassword").click();
        }
    }
});


var PasswordRecoveryHelper = {    
    ShowPassword: function (fieldId, eyeIcon) {
        var field = document.getElementById(fieldId);
        var icon = eyeIcon;
        if (field.type === "password") {
            field.type = "text";
            icon.className = "fa fa-eye field-icon2";
        } else {
            field.type = "password";
            icon.className = "fa fa-eye-slash field-icon2";
        }
    },

    ValidatePasswordRecovery: function () {

        $("#passwordRecoveryForm").validate({
            rules: {
                //userId: "required",
                txtPhone: {
                    required: true,
                    digits: true,
                    minlength: 10,
                    maxlength: 15
                },
                txtUserName: "required",

                txtPassword: {
                    required: true,
                    minlength: 6
                },
                txtConfirmPassword: {
                    required: true,
                    equalTo: "#txtNewPassword"
                },

            },
            messages: {
                //userId: "User ID is required",
                txtPhone: {
                    required: "Phone Number is required",
                    digits: "Please enter a valid phone number",
                    minlength: "Phone number must be at least 10 digits",
                    maxlength: "Phone number must not exceed 15 digits"
                },               
                txtPassword: {
                    required: "Password is required",
                    minlength: "Password must be at least 6 characters"
                },
                txtConfirmPassword: {
                    required: "Please confirm your password",
                    equalTo: "Password did not match"
                },
            },
            errorPlacement: function (label, element) {
                label.addClass('error');
                element.parent().append(label);
            }
        });
    },
    RecoverPassword: function () {
        $("body").addClass("loading");
        var phoneNumber = $("#txtPhone").val();
        var newPassword = $("#txtNewPassword").val();
        var confirmPassword = $("#txtConfirmPassword").val();
        var serviceUrl = "/Registration/RecoverPassword";
        $.ajax({
            url: serviceUrl,
            type: "POST",
            data: { PhoneNumber: phoneNumber, UserPass: newPassword },
            success: function (response) {
               // console.log(response);
                if (response.success) {
                    swal({
                        title: "Congratulation!!",
                        text: "Password Recovery Successfull",
                        type: "success",
                        closeOnConfirm: false,

                    });
                    window.location.href = '/Login/Login';
                    //location.reload();
                    $("body").removeClass("loading");
                }
                    else if (response.message=="NE") {
                    swal({
                        title: "Sorry!",
                        text: "Failed to save!",
                        type: "error",
                        closeOnConfirm: false,
                    });
                    //window.location.href = response.RedirectUrl;
                    //location.reload();
                    $("body").removeClass("loading");
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Failed to save!",
                        type: "error",
                        closeOnConfirm: false,
                    });
                    $("body").removeClass("loading");

                }
            },
            error: function (data) {
                swal({
                    title: "Sorry!",
                    text: "Something Went Wrong !!! \n" + data.statusText,
                    type: "error",
                    closeOnConfirm: false
                });
                $("body").removeClass("loading");

            }
        });
    },
};



