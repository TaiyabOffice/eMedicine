let rowId = "";
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
    BrandHelper.GenerateCombo($("#cmbCompanyId"), "SP_SelectGetAllDropDown", "GETALLCOMPANY", "0", "0", "0", "0", "0");
    BrandHelper.GenerateCombo($("#cmbGenericId"), "SP_SelectGetAllDropDown", "GETALLGENERIC", "0", "0", "0", "0", "0");
    BrandHelper.BuildTbl("");
    BrandHelper.GetAllBrand();

});
$("#btnSave").click(function (event) {
    event.preventDefault();
    BrandHelper.SaveCollectionData();
    location.reload();
});
$("#btnUpdate").click(function (event) {
    event.preventDefault();
    BrandHelper.UpdateCollectionData();
    location.reload();
});
$("#btnClear").click(function (event) {
    event.preventDefault();
    location.reload();
});

var BrandHelper = {
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
                    objcmb.append($("<option></option>").attr("value", "0").text("-Select-"));
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
        $('#tblBrand').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },
                { data: 'BrandId' },
                { data: 'BrandName' },
                { data: 'BrandDescription' },
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
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="BrandHelper.GetBrandID(\'' + row.BrandId + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button><button id="btnDetails" name="btnDetails" type="button" title="Details" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="BrandHelper.GetDetailsByBrandID(\'' + row.BrandId + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-eye" style="font-size:15px; padding:0px;"></i></button>';
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

        var BrandData = {
            BrandId: $('#txtBrandId').val() ? "" : "000000000000",
            BrandName: $('#txtName').val(),
            BrandNameBN: $('#txtNameBN').val(),
            BrandDescription: $('#txtDescription').val(),
            BrandDescriptionBN: $('#txtDescriptionBN').val(),
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
            url: '/Brand/CreateBrand', // Your controller action
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(BrandData), // Send as JSON
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
                    BrandHelper.GetAllBrand()
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
                    text: "Error retrieving Brand.!" + error,
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    UpdateCollectionData: function () {

        var BrandData = {
            BrandId: $('#txtBrandId').val(),
            BrandName: $('#txtName').val(),
            BrandNameBN: $('#txtNameBN').val(),
            BrandDescription: $('#txtDescription').val(),
            BrandDescriptionBN: $('#txtDescriptionBN').val(),
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
            url: '/Brand/UpdateBrandById', // Your controller action
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(BrandData), // Send as JSON
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
                BrandHelper.GetAllBrand();
            },
            error: function (xhr, status, error) {
                swal({
                    title: "Sorry!",
                    text: "Error retrieving Brand.!" + error,
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    GetAllBrand: function () {
        var serviceUrl = "/Brand/GetAllBrand";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result) {
                if (result.success) {
                    BrandHelper.BuildTbl(result.data);
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving Brands.!" + result.message,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "Error retrieving Brands.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    GetBrandID: function (BrandId) {
        $("#btnSave").hide();
        $("#btnUpdate").show();
        var jsonParam = { BrandId: BrandId };
        var serviceUrl = "/Brand/GetBrandById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                //console.log(response.data);
                if (response.Success) {
                    var Brand = response.data;

                    $('#txtBrandId').val(Brand.BrandId);
                    $('#txtName').val(Brand.BrandName);
                    $('#txtNameBN').val(Brand.BrandNameBN);
                    $('#txtDescription').val(Brand.BrandDescription);
                    $('#txtDescriptionBN').val(Brand.BrandDescriptionBN);
                    $('#txtIndications').val(Brand.Indications);
                    $('#txtIndicationsBN').val(Brand.IndicationsBN);
                    $('#txtContraindications').val(Brand.Contraindications);
                    $('#txtContraindicationsBN').val(Brand.ContraindicationsBN);
                    $('#txtTherapeuticClass').val(Brand.TherapeuticClass);
                    $('#txtTherapeuticClassBN').val(Brand.TherapeuticClassBN);
                    $('#txtSideEffects').val(Brand.SideEffects);
                    $('#txtSideEffectsBN').val(Brand.SideEffectsBN);
                    $('#txtPrecautions').val(Brand.Precautions);
                    $('#txtPrecautionsBN').val(Brand.PrecautionsBN);
                    $('#txtInteractions').val(Brand.Interactions);
                    $('#txtInteractionsBN').val(Brand.InteractionsBN);
                    $('#CmbIsActive').val(Brand.IsActive);
                } else {
                    swal({
                        title: "Sorry!",
                        text: "No Brand data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "No Brand data found.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    GetDetailsByBrandID: function (BrandId) {

        var jsonParam = { BrandId: BrandId };
        var serviceUrl = "/Brand/GetBrandById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                //console.log(response.data);
                if (response.Success) {
                    var Brand = response.data;
                    BrandHelper.clrMdl();
                    $('#mdlTitle').html("Brand Details for: " + Brand.BrandId + " - " + Brand.BrandName + " - " + Brand.BrandNameBN);                    
                    $('#MdlName').html("Name: " + Brand.BrandName);
                    $('#MdlNameBN').html("জেনেরিক নাম: " + Brand.BrandNameBN);
                    $('#MdlDescription').html("Description: " + Brand.BrandDescription);
                    $('#MdlDescriptionBN').html("বর্ণনা: " + Brand.BrandDescriptionBN);
                    $('#MdlIndications').html("Indications: " + Brand.Indications);
                    $('#MdlIndicationsBN').html("ইঙ্গিত: " + Brand.IndicationsBN);
                    $('#MdlContraindications').html("Contraindications: " + Brand.Contraindications);
                    $('#MdlContraindicationsBN').html("বিপরীত: " + Brand.ContraindicationsBN);
                    $('#MdlTherapeuticClass').html("Therapeutic-Class: " + Brand.TherapeuticClass);
                    $('#MdlTherapeuticClassBN').html("থেরাপিউটিক ক্লাস: " + Brand.TherapeuticClassBN);
                    $('#MdlSideEffects').html("Side-Effects: " + Brand.SideEffects);
                    $('#MdlSideEffectsBN').html("পার্শ্ব প্রতিক্রিয়া: " + Brand.SideEffectsBN);
                    $('#MdlPrecautions').html("Precautions: " + Brand.Precautions);
                    $('#MdlPrecautionsBN').html("সতর্কতা: " + Brand.PrecautionsBN);
                    $('#MdlInteractions').html("Interactions: " + Brand.Interactions);
                    $('#MdlInteractionsBN').html("মিথষ্ক্রিয়া: " + Brand.InteractionsBN);
                    if (Brand.IsActive == "1") {
                        $('#mdlIsActive').html("Status: Active");
                    }
                    else {
                        $('#mdlIsActive').html("Status: InActive");
                    }
                    $('#MdlCmbIsActive').html("IsActive: " + Brand.IsActive);
                    $("#modal-default").modal("show");
                }
                else {
                    swal({
                        title: "Sorry!",
                        text: "No Brand data found.!",
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
        $('#MdlBrandId').html("");
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
        var caratPos = BrandHelper.getSelectionStart(el);
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
    }
};