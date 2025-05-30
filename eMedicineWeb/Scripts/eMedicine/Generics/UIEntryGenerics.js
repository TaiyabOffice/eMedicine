﻿let rowId = "";
$(document).ready(function () {

    $(".select2").select2();
    $("#btnSave").show();
    $("#btnUpdate").hide();  
    jQuery.ajax({
        url: "/Common/GetCurrentDate",
        type: "POST",
        success: function (result) {
            $("#hdnDateToday").datepicker({ format: "dd-M-yyyy", autoclose: true });
            $("#hdnDateToday").datepicker('setDate', new Date(result));
        }
    });
    GenericsHelper.BuildTbl("");
    GenericsHelper.GetAllGenerics();
    GenericsHelper.ValidateGenerics();

});
$("#btnSave").click(function (event) {
    event.preventDefault();
    GenericsHelper.SaveCollectionData();
});
$("#btnUpdate").click(function (event) {
    event.preventDefault();
    GenericsHelper.UpdateCollectionData();
});
$("#btnClear").click(function (event) {
    event.preventDefault();
    location.reload();
});

var GenericsHelper = {
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
        $('#tblGenerics').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },
                { data: 'GenericsId' },
                { data: 'GenericsName' },
                { data: 'GenericsDescription' },
                { data: 'Indications' },
                { data: 'Contraindications' },
                { data: 'TherapeuticClass' },
                { data: 'SideEffects' },
                { data: 'Precautions' },
                { data: 'Interactions' },
                { data: 'IsActive' },
                {
                    data: null,
                    render: function (data, type, row) {
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="GenericsHelper.GetGenericsID(\'' + row.GenericsId + '\')" class="btn btn-sm btn-danger"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button><button id="btnDetails" name="btnDetails" type="button" title="Details" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="GenericsHelper.GetDetailsByGenericsID(\'' + row.GenericsId + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-eye" style="font-size:15px; padding:0px;"></i></button>';
                    }
                }
            ],
            "columnDefs": [
                {
                    "targets": [0],
                    "width": "2%",
                    render: function (data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1; },
                },
                { "className": "dt-center", "targets": [] },
                { "className": "dt-left", "targets": [] },

            ]

        });

    },
    SaveCollectionData: function () {
        if ($("#validateGenerics").valid()) {
            var GenericsData = {
                GenericsId: $('#txtGenericsId').val() ? "" : "000000000000",
                GenericsName: $('#txtName').val(),
                GenericsNameBN: $('#txtNameBN').val(),
                GenericsDescription: $('#txtDescription').val(),
                GenericsDescriptionBN: $('#txtDescriptionBN').val(),
                Indications: $('#txtIndications').val(),
                IndicationsBN: $('#txtIndicationsBN').val(),
                Contraindications: $('#txtContraindications').val(),
                ContraindicationsBN: $('#txtContraindicationsBN').val(),
                TherapeuticClass: $('#txtTherapeuticClass').val(),
                TherapeuticClassBN: $('#txtTherapeuticClassBN').val(),
                SideEffects: $('#txtSideEffects').val(),
                SideEffectsBN: $('#txtSideEffectsBN').val(),
                Precautions: $('#txtPrecautions').val(),
                PrecautionsBN: $('#txtPrecautionsBN').val(),
                Interactions: $('#txtInteractions').val(),
                InteractionsBN: $('#txtInteractionsBN').val(),
                IsActive: $('#CmbIsActive').val(),
                CreatedBy: $('#hdnUserId').val(),
                CreatedDate: $('#hdnDateToday').val(),
                UpdatedBy: $('#hdnUserId').val(),
                UpdatedDate: $('#hdnDateToday').val()
            };
            $.ajax({
                url: '/Generics/CreateGenerics', // Your controller action
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(GenericsData), // Send as JSON
                success: function (response) {
                    // Success message
                    //console.log(response);
                    if (response.success) {
                        swal({
                            title: "Congratulations",
                            text: "Saved successfully!",
                            type: "success",
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            timer: 2000
                        });
                        location.reload();

                        GenericsHelper.GetAllGenerics()
                    } else {
                        swal({
                            title: "Sorry!",
                            text: "Saved Failde!",
                            type: "error",
                            closeOnConfirm: false,
                            //timer: 2000
                        });
                    }

                },
                error: function (xhr, status, error) {
                    // Handle errors
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving Generics.!" + error,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            });
        }
    },
    UpdateCollectionData: function () {
        if ($("#validateGenerics").valid()) {
            var GenericsData = {
                GenericsId: $('#txtGenericsId').val(),
                GenericsName: $('#txtName').val(),
                GenericsNameBN: $('#txtNameBN').val(),
                GenericsDescription: $('#txtDescription').val(),
                GenericsDescriptionBN: $('#txtDescriptionBN').val(),
                Indications: $('#txtIndications').val(),
                IndicationsBN: $('#txtIndicationsBN').val(),
                Contraindications: $('#txtContraindications').val(),
                ContraindicationsBN: $('#txtContraindicationsBN').val(),
                TherapeuticClass: $('#txtTherapeuticClass').val(),
                TherapeuticClassBN: $('#txtTherapeuticClassBN').val(),
                SideEffects: $('#txtSideEffects').val(),
                SideEffectsBN: $('#txtSideEffectsBN').val(),
                Precautions: $('#txtPrecautions').val(),
                PrecautionsBN: $('#txtPrecautionsBN').val(),
                Interactions: $('#txtInteractions').val(),
                InteractionsBN: $('#txtInteractionsBN').val(),
                IsActive: $('#CmbIsActive').val(),
                CreatedBy: $('#hdnUserId').val(),
                CreatedDate: $('#hdnDateToday').val(),
                UpdatedBy: $('#hdnUserId').val(),
                UpdatedDate: $('#hdnDateToday').val()
            };
            $.ajax({
                url: '/Generics/UpdateGenericsById', // Your controller action
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(GenericsData), // Send as JSON
                success: function (response) {
                    // Success message               
                    swal({
                        title: "Congratulations",
                        text: "saved successfully!",
                        type: "success",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        timer: 2000
                    });
                    location.reload();

                    GenericsHelper.GetAllGenerics();
                },
                error: function (xhr, status, error) {
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving Generics.!" + error,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            });
        }
    },
    GetAllGenerics: function () {
        var serviceUrl = "/Generics/GetAllGenerics";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result) {
                if (result.success) {
                    GenericsHelper.BuildTbl(result.data);
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving Genericss.!" + result.message,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "Error retrieving Genericss.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    GetGenericsID: function (GenericsId) {
        $("#btnSave").hide();
        $("#btnUpdate").show();
        var jsonParam = { GenericsId: GenericsId };
        var serviceUrl = "/Generics/GetGenericsById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                //console.log(response.data);
                if (response.Success) {
                    var Generics = response.data;

                    $('#txtGenericsId').val(Generics.GenericsId);
                    $('#txtName').val(Generics.GenericsName);
                    $('#txtNameBN').val(Generics.GenericsNameBN);
                    $('#txtDescription').val(Generics.GenericsDescription);
                    $('#txtDescriptionBN').val(Generics.GenericsDescriptionBN);
                    $('#txtIndications').val(Generics.Indications);
                    $('#txtIndicationsBN').val(Generics.IndicationsBN);
                    $('#txtContraindications').val(Generics.Contraindications);
                    $('#txtContraindicationsBN').val(Generics.ContraindicationsBN);
                    $('#txtTherapeuticClass').val(Generics.TherapeuticClass);
                    $('#txtTherapeuticClassBN').val(Generics.TherapeuticClassBN);
                    $('#txtSideEffects').val(Generics.SideEffects);
                    $('#txtSideEffectsBN').val(Generics.SideEffectsBN);
                    $('#txtPrecautions').val(Generics.Precautions);
                    $('#txtPrecautionsBN').val(Generics.PrecautionsBN);
                    $('#txtInteractions').val(Generics.Interactions);
                    $('#txtInteractionsBN').val(Generics.InteractionsBN);
                    $('#CmbIsActive').val(Generics.IsActive);
                } else {
                    swal({
                        title: "Sorry!",
                        text: "No Generics data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "No Generics data found.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    GetDetailsByGenericsID: function (GenericsId) {

        var jsonParam = { GenericsId: GenericsId };
        var serviceUrl = "/Generics/GetGenericsById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                //console.log(response.data);
                if (response.Success) {
                    var Generics = response.data;
                    GenericsHelper.clrMdl();
                    $('#mdlTitle').html("Generics Details for: " + Generics.GenericsId + " - " + Generics.GenericsName + " - " + Generics.GenericsNameBN);                    
                    $('#MdlName').html("Name: " + Generics.GenericsName);
                    $('#MdlNameBN').html("জেনেরিক নাম: " + Generics.GenericsNameBN);
                    $('#MdlDescription').html("Description: " + Generics.GenericsDescription);
                    $('#MdlDescriptionBN').html("বর্ণনা: " + Generics.GenericsDescriptionBN);
                    $('#MdlIndications').html("Indications: " + Generics.Indications);
                    $('#MdlIndicationsBN').html("ইঙ্গিত: " + Generics.IndicationsBN);
                    $('#MdlContraindications').html("Contraindications: " + Generics.Contraindications);
                    $('#MdlContraindicationsBN').html("বিপরীত: " + Generics.ContraindicationsBN);
                    $('#MdlTherapeuticClass').html("Therapeutic-Class: " + Generics.TherapeuticClass);
                    $('#MdlTherapeuticClassBN').html("থেরাপিউটিক ক্লাস: " + Generics.TherapeuticClassBN);
                    $('#MdlSideEffects').html("Side-Effects: " + Generics.SideEffects);
                    $('#MdlSideEffectsBN').html("পার্শ্ব প্রতিক্রিয়া: " + Generics.SideEffectsBN);
                    $('#MdlPrecautions').html("Precautions: " + Generics.Precautions);
                    $('#MdlPrecautionsBN').html("সতর্কতা: " + Generics.PrecautionsBN);
                    $('#MdlInteractions').html("Interactions: " + Generics.Interactions);
                    $('#MdlInteractionsBN').html("মিথষ্ক্রিয়া: " + Generics.InteractionsBN);
                    if (Generics.IsActive == "1") {
                        $('#mdlIsActive').html("Status: Active");
                    }
                    else {
                        $('#mdlIsActive').html("Status: InActive");
                    }                    
                    $("#modal-default").modal("show");
                }
                else {
                    swal({
                        title: "Sorry!",
                        text: "No Generics data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            }
        });
    },
    clrMdl: function (o)
    {
        $('#MdlGenericsId').html("");
        $('#mdlTitle').html("");
        $('#MdlName').html("");
        $('#MdlNameBN').html("");
        $('#MdlDescription').html("");
        $('#MdlDescriptionBN').html("");
        $('#MdlIndications').html("");
        $('#MdlIndicationsBN').html("");
        $('#MdlContraindications').html("");
        $('#MdlContraindicationsBN').html("");
        $('#MdlTherapeuticClass').html("");
        $('#MdlTherapeuticClassBN').html("");
        $('#MdlSideEffects').html("");
        $('#MdlSideEffectsBN').html("");
        $('#MdlPrecautions').html("");
        $('#MdlPrecautionsBN').html("");
        $('#MdlInteractions').html("");
        $('#MdlInteractionsBN').html("");      
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
        var caratPos = GenericsHelper.getSelectionStart(el);
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
    ValidateGenerics: function () {
        $.validator.addMethod("notZero", function (value, element) {
            return this.optional(element) || value != ""; 
        }, "Please select a valid option");

        $("#validateGenerics").validate({
            rules: {
                txtName: "required",
                txtDescription: "required",
                txtIndications: "required",
                txtContraindications: "required",
                txtTherapeuticClass: "required",
                txtSideEffects: "required",
                txtPrecautions: "required",
                txtInteractions: "required",
                txtNameBN: "required",
                txtDescriptionBN: "required",
                txtIndicationsBN: "required",
                txtContraindicationsBN: "required",
                txtTherapeuticClassBN: "required",
                txtSideEffectsBN: "required",
                txtPrecautionsBN: "required",
                txtInteractionsBN: "required",
                CmbIsActive: {
                    required: true,
                    notZero: "" 
                }
            },
            messages: {
                txtName: "Generic Name is required",
                txtDescription: "Description is required",
                txtIndications: "Indications are required",
                txtContraindications: "Contraindications are required",
                txtTherapeuticClass: "Therapeutic Class is required",
                txtSideEffects: "Side Effects are required",
                txtPrecautions: "Precautions are required",
                txtInteractions: "Interactions are required",
                txtNameBN: "জেনেরিক নাম প্রয়োজন",
                txtDescriptionBN: "বর্ণনা প্রয়োজন",
                txtIndicationsBN: "ইঙ্গিত প্রয়োজন",
                txtContraindicationsBN: "বিপরীত প্রয়োজন",
                txtTherapeuticClassBN: "থেরাপিউটিক ক্লাস প্রয়োজন",
                txtSideEffectsBN: "পার্শ্ব প্রতিক্রিয়া প্রয়োজন",
                txtPrecautionsBN: "সতর্কতা প্রয়োজন",
                txtInteractionsBN: "মিথষ্ক্রিয়া প্রয়োজন",
                CmbIsActive: "Please select if active or not"
            },
            errorPlacement: function (label, element) {
                label.addClass('error');
                element.parent().append(label);
            }
        });
    },

};