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
    GenericsHelper.BuildTbl("");
    GenericsHelper.GetAllGenerics();

});
$("#btnSave").click(function (event) {
    event.preventDefault();
    GenericsHelper.SaveCollectionData();
    location.reload();
});

$("#btnUpdate").click(function (event) {
    event.preventDefault();
    GenericsHelper.UpdateCollectionData();
    location.reload();
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
            success: function (data)
        {
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
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="GenericsHelper.GetGenericsID(\'' + row.GenericsId + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button>';
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
                    GenericsHelper.GetAllGenerics()
                } else
                {
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
    },
    UpdateCollectionData: function () {

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
                if (response.Success)
                {
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
    }
};