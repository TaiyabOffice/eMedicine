$(document).ready(function () {
    $(".select2").select2();
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
        //$.validator.addMethod("passwordMatch", function (value, element) {
        //    return value === $("#txtPassword").val();
        //}, "Passwords do not match");

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
                if (response.success) {
                    swal({
                        title: "Congratulation!!",
                        text: "Password Recovery Successfull",
                        type: "success",
                        closeOnConfirm: false,

                    });
                    window.location.href = response.RedirectUrl;
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



