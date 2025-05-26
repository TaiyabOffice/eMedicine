let rowId = "";
$(document).ready(function () {
  
    //$(".select2").select2();
    $('#cmbMedicines').select2({
        placeholder: "Select Medicines",
        allowClear: true
    });
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

    DiseaseHelper.GenerateCombo($("#cmbMedicines"), "SP_SelectGetAllDropDown", "GETALLACTIVEITEMS", "0", "0", "0", "0", "0");
    DiseaseHelper.BuildTbl("");
    DiseaseHelper.GetAllDisease();
    DiseaseHelper.ValidateDisease();

});
$("#btnSave").click(function (event) {
    event.preventDefault();
    DiseaseHelper.SaveCollectionData();
});
$("#btnUpdate").click(function (event) {
    event.preventDefault();
    DiseaseHelper.UpdateCollectionData();
});
$("#btnClear").click(function (event) {
    event.preventDefault();
    location.reload();
});

var DiseaseHelper = {
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
        $('#tblDisease').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },
                { data: 'DiseaseId' },
                { data: 'Disease Name' },
                { data: 'Disease Descriptions' },
                { data: 'Medicines' },                
                { data: 'IsActive' },
                {
                    data: null,
                    render: function (data, type, row) {
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="DiseaseHelper.GetDiseaseID(\'' + row.DiseaseId + '\')" class="btn btn-sm btn-danger"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button>';
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
        if ($("#validateDisease").valid()) {

            var DiseaseData = {
                DiseaseId: $('#txtDiseaseId').val() ? "" : "000000000000",
                DiseaseName: $('#txtDiseaseName').val(),
                DiseaseDescriptions: $('#txtDiseaseDescriptions').val(),
                DiseaseDescriptionsBN: $('#txtDiseaseDescriptionsBN').val(),
                MedicinesID: $('#cmbMedicines').val() ? $('#cmbMedicines').val().join(',') : '',                
                Advice: $('#txtAdvice').val(),                
                AdviceBN: $('#txtAdviceBN').val(),                
                IsActive: $('#CmbIsActive').val(),
                CreatedBy: $('#hdnUserId').val(),
                CreatedDate: $('#hdnDateToday').val(),
                UpdatedBy: $('#hdnUserId').val(),
                UpdatedDate: $('#hdnDateToday').val()
            };
            $.ajax({
                url: '/Item/CreateDiseaseData', // Your controller action
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(DiseaseData), // Send as JSON
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

                        DiseaseHelper.GetAllDisease()
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
                        text: "Error retrieving Disease.!" + error,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            });
        }
    },
    UpdateCollectionData: function () {
        if ($("#validateDisease").valid()) {

            var DiseaseData = {
                DiseaseId: $('#txtDiseaseId').val(),
                DiseaseName: $('#txtDiseaseName').val(),
                DiseaseDescriptions: $('#txtDiseaseDescriptions').val(),
                DiseaseDescriptionsBN: $('#txtDiseaseDescriptionsBN').val(),
                MedicinesID: $('#cmbMedicines').val(),
                Advice: $('#txtAdvice').val(),
                AdviceBN: $('#txtAdviceBN').val(),
                IsActive: $('#CmbIsActive').val(),
                CreatedBy: $('#hdnUserId').val(),
                CreatedDate: $('#hdnDateToday').val(),
                UpdatedBy: $('#hdnUserId').val(),
                UpdatedDate: $('#hdnDateToday').val()
            };
            $.ajax({
                url: '/Item/UpdateDiseaseById', // Your controller action
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(DiseaseData), // Send as JSON
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

                    DiseaseHelper.GetAllDisease();
                },
                error: function (xhr, status, error) {
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving Disease.!" + error,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            });
        }
    },
    GetAllDisease: function () {
        var serviceUrl = "/Item/GetAllDisease";
        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            success: function (result) {
                if (result.success) {                 
                    DiseaseHelper.BuildTbl(result.data);
                } else {
                    swal({
                        title: "Sorry!",
                        text: "Error retrieving Diseases.!" + result.message,
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "Error retrieving Diseases.!",
                    type: "error",
                    closeOnConfirm: false,
                    //timer: 2000
                });
            }
        });
    },
    GetDiseaseID: function (DiseaseId) {
        $("#btnSave").hide();
        $("#btnUpdate").show();
        var jsonParam = { DiseaseId: DiseaseId };
        var serviceUrl = "/Item/GetDiseaseById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                //console.log(response.data);
                if (response.Success)
                {                   
                    var Disease = response.data;                    
                    //$("#cmbCompanyId").empty();
                    $('#txtDiseaseId').val(Disease.DiseaseId);
                    $('#txtDiseaseName').val(Disease.DiseaseName);
                    $('#txtDiseaseNameBN').val(Disease.DiseaseNameBN);
                    $('#txtDiseaseDescriptions').val(Disease.DiseaseDescriptions);
                    $('#txtDiseaseDescriptionsBN').val(Disease.DiseaseDescriptionsBN);                    
                    //$("#cmbMedicines").val(Disease.cmbMedicines).select2();
                    if (Disease.MedicinesID) {
                        $("#cmbMedicines").val(Disease.MedicinesID).trigger('change'); // Use trigger to update Select2
                    }
                    $('#txtAdvice').val(Disease.Advice);                                    
                    $('#txtAdviceBN').val(Disease.AdviceBN);                                    
                    $('#CmbIsActive').val(Disease.IsActive);                                    
                } else {
                    swal({
                        title: "Sorry!",
                        text: "No Disease data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            },
            error: function () {
                swal({
                    title: "Sorry!",
                    text: "No Disease data found.!",
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
        var caratPos = DiseaseHelper.getSelectionStart(el);
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
    ValidateDisease: function () {
        $.validator.addMethod("notZero", function (value, element) {
            return this.optional(element) || value != "";
        }, "Please select a valid option");

        $("#validateDisease").validate({
            rules: {
                txtDiseaseName: "required",
                txtDiseaseDescriptions: "required",
                txtDiseaseNameBN: "required",
                txtDiseaseDescriptionsBN: "required",
                cmbMedicines: {
                    required: true,
                    notZero: "" 
                },
                CmbIsActive: {
                    required: true,
                    notZero: "" 
                }
            },
            messages: {
                txtDiseaseName: "Disease Name is required",
                txtDiseaseDescriptions: "Disease Descriptions is required",
                txtDiseaseNameBN: "Disease Name is required",
                txtDiseaseDescriptionsBN: "Disease Descriptions is required", 
                cmbMedicines: "Please select a valid company",
                CmbIsActive: "Please select if the Disease is active or not"
            },
            errorPlacement: function (label, element) {
                label.addClass('error');
                element.parent().append(label);
            }
        });
    },
    GetDetailsByDiseaseID: function (DiseaseId) {

        var jsonParam = { DiseaseId: DiseaseId };
        var serviceUrl = "/Item/GetDiseaseById";

        jQuery.ajax({
            url: serviceUrl,
            type: "POST",
            data: jsonParam,
            success: function (response) {
                //console.log(response.data);
                if (response.Success) {
                    var Item = response.data;
                    DiseaseHelper.clrMdl();
                    $('#mdlTitle').html("Disease Details for: " + Item.DiseaseId + " - " + Item.DiseaseName + " - " + Item.ItemNameBN);
                    $('#mdlDiseaseId').val(Disease.DiseaseId);
                    $('#mdlDiseaseName').val(Disease.DiseaseName);
                    $('#mdlDiseaseNameBN').val(Disease.DiseaseNameBN);
                    $('#mdlDiseaseDescriptions').val(Disease.DiseaseDescriptions);
                    $('#mdlDiseaseDescriptionsBN').val(Disease.DiseaseDescriptionsBN);
                    $("#mdlMedicines").val(Disease.cmbMedicines).select2();
                    $('#mdlAdvice').val(Disease.Advice);
                    $('#mdlAdviceBN').val(Disease.AdviceBN);
                    $('#CmbIsActive').val(Disease.IsActive); 
                    $("#modal-default").modal("show");
                }
                else {
                    swal({
                        title: "Sorry!",
                        text: "No Item data found.!",
                        type: "error",
                        closeOnConfirm: false,
                        //timer: 2000
                    });
                }
            }
        });
    },
    clrMdl: function (o) {
        $('#mdlTitle').html("");
        $('#mdlDiseaseId').html("");
        $('#mdlDiseaseName').html("");
        $('#mdlDiseaseNameBN').html("");
        $('#mdlDiseaseDescriptions').html("");
        $('#mdlDiseaseDescriptionsBN').html("");
        $("#mdlMedicines").html("");
        $('#mdlAdvice').html("");
        $('#mdlAdviceBN').html("");
        $('#CmbIsActive').html("");
    },
};