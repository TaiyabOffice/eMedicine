$(document).ready(function () {
    $(".select2").select2();
    RegistrationHelper.ValidateRegistration();
    RegistrationHelper.GenerateCombo($("#cmbDistrictId"), "SP_SelectGetAllDropDown", "GETALLDISTRICT", "0", "0", "0", "0", "0");
  

});

$("#btnRegister").click(function () {
    if ($("#validateRegistration").valid()) {
        $("body").addClass("loading");
        RegistrationHelper.RegisterData();
    }
});

$("#txtEmail, #txtPassword, #txtConfirmPassword").on("keydown", function (e) {
    if (e.keyCode == 13) {
        if ($("#validateRegistration").valid()) {
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

    ValidateRegistration: function () {
        //$.validator.addMethod("passwordMatch", function (value, element) {
        //    return value === $("#txtPassword").val();
        //}, "Passwords do not match");

        $("#registrationForm").validate({
            rules: {
                //userId: "required",
                phone: {
                    required: true,
                    digits: true,
                    minlength: 10,
                    maxlength: 15
                },
                username: "required",

                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 6
                },
                confirmPassword: {
                    required: true,
                    equalTo: "#password"
                }
            },
            messages: {
                //userId: "User ID is required",
                phone: {
                    required: "Phone Number is required",
                    digits: "Please enter a valid phone number",
                    minlength: "Phone number must be at least 10 digits",
                    maxlength: "Phone number must not exceed 15 digits"
                },
                username: "Username is required",
                email: {
                    required: "Email Address is required",
                    email: "Please enter a valid email address"
                },
                password: {
                    required: "Password is required",
                    minlength: "Password must be at least 6 characters"
                },
                confirmPassword: {
                    required: "Please confirm your password",
                    equalTo: "Password did not match"
                }
            },
            errorPlacement: function (label, element) {
                label.addClass('error');
                element.parent().append(label);
            }
        });
    },

    RegisterData: function () {
        var obj = new Object();

        //obj.DESC1 = $("#txtUserId").val();
        obj.DESC1 = $("#txtPhone").val();
        obj.DESC2 = $("#txtUserName").val();
        obj.DESC3 = $("#txtEmail").val();
        obj.DESC4 = $("#txtPassword").val();


        var objDetails = JSON.stringify(obj);

        var jsonParam = "objDetails:" + objDetails;

        var serviceUrl = "/Registration/CreateRegistration";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: "{" + jsonParam + "}",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.status) {

                    swal({
                        title: "Congratulation!!",
                        text: "Save Successfully",
                        type: "success",
                        closeOnConfirm: false,

                    });
                    location.reload();

                } else {
                    swal({
                        title: "Sorry!",
                        text: "Failed to save!",
                        type: "error",
                        closeOnConfirm: false,
                    });
                }
            },
            error: function (data) {
                swal({
                    title: "Sorry!",
                    text: "Something Went Wrong !!! \n" + data.statusText,
                    type: "error",
                    closeOnConfirm: false
                });
            }

        });
    }
};

