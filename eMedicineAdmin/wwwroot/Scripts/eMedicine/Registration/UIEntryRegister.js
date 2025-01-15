$(document).ready(function () {   
    RegistrationHelper.ValidateRegistration();
    RegistrationHelper.GenerateCombo($("#cmbDistrictId"), "SP_SelectGetAllDropDown", "GETALLDISTRICT", "0", "0", "0", "0", "0");
});

$("#btnRegister").click(function () {
    if ($("#registrationForm").valid()) {
        $("body").addClass("loading");
        RegistrationHelper.RegisterData();
    }
});

$("#txtEmail, #txtPassword, #txtConfirmPassword").on("keydown", function (e) {
    if (e.keyCode == 13) {
        if ($("#registrationForm").valid()) {
            $("#btnRegister").click();
        }
    }
});

$("#cmbDistrictId").on("change", function (e)
{
    $("#cmbUpazilasId").empty();
    RegistrationHelper.GenerateCombo($("#cmbUpazilasId"), "SP_SelectGetAllDropDown", "GETALLUPAZILA", $("#cmbDistrictId").val(), "0", "0", "0", "0");
});

var RegistrationHelper = {
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
                        objcmb.append($("<option></option>").attr("value", item.id).text(item.name));
                    });
                }
                else {
                    objcmb.append($("<option></option>").attr("value", "").text("-Select-"));
                    $.each(data.data, function (key, item) {
                        objcmb.append($("<option></option>").attr("value", item.id).text(item.name));
                    });

                }
                // this is for to work onchange event when only one data is returned
                objcmb.select2();
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
    ValidateRegistration: function () {
        //$.validator.addMethod("passwordMatch", function (value, element) {
        //    return value === $("#txtPassword").val();
        //}, "Passwords do not match");

        $("#registrationForm").validate({
            rules: {
                //userId: "required",
                txtPhone: {
                    required: true,
                    digits: true,
                    minlength: 10,
                    maxlength: 15
                },
                txtUserName: "required",

                txtEmail: {
                    required: true,
                    email: true
                },
                txtPassword: {
                    required: true,
                    minlength: 6
                },
                txtConfirmPassword: {
                    required: true,
                    equalTo: "#txtPassword"
                },
                cmbDistrictId: {
                    required: true,
                },
                cmbUpazilasId: {
                    required: true,
                }
            },
            messages: {
                //userId: "User ID is required",
                txtPhone: {
                    required: "Phone Number is required",
                    digits: "Please enter a valid phone number",
                    minlength: "Phone number must be at least 10 digits",
                    maxlength: "Phone number must not exceed 15 digits"
                },
                txtUserName: "Username is required",
                txtEmail: {
                    required: "Email Address is required",
                    email: "Please enter a valid email address"
                },
                txtPassword: {
                    required: "Password is required",
                    minlength: "Password must be at least 6 characters"
                },
                txtConfirmPassword: {
                    required: "Please confirm your password",
                    equalTo: "Password did not match"
                },
                cmbDistrictId: "Please select any District",
                cmbUpazilasId: "Please select any Upazila",
            },
            errorPlacement: function (label, element) {
                label.addClass('error');
                element.parent().append(label);
            }
        });
    },
    RegisterData: function () {

        var json = {            
            PhoneNumber : $("#txtPhone").val(),
            UserName : $("#txtUserName").val(),
            Email : $("#txtEmail").val(),
            Password : $("#txtConfirmPassword").val(),
            DistrictId : $("#cmbDistrictId").val(),
            DistrictName : $("#cmbDistrictId").val(),
            UpazilasId : $("#cmbUpazilasId").val(),
            UpazilasName : $("#cmbUpazilasId").val(),
            IsActive : "1"
        };

        $.ajax({
            type: "POST",
            url: "/Registration/CreateRegistration",
            data: JSON.stringify(json),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    swal({
                        title: "Congratulation!!",
                        text: "Registration Successfull",
                        type: "success",
                        closeOnConfirm: false,

                    });
                    window.location.href = '/Login/Login';
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

