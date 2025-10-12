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

    DiseaseHelper.GenerateCombo($("#cmbMedicines"), "SP_SelectGetAllDropDown", "GETALLGENERIC", "0", "0", "0", "0", "0");
    DiseaseHelper.GenerateCombo($("#mdlcmbMedicines"), "SP_SelectGetAllDropDown", "GETALLACTIVEITEMS", "0", "0", "0", "0", "0");
    //BrandHelper.GenerateCombo($("#mdlcmbMedicines"), "SP_SelectGetAllDropDown", "GETALLGENERIC", "0", "0", "0", "0", "0");
    DiseaseHelper.BuildTbl("");
    DiseaseHelper.GetAllDisease();
    DiseaseHelper.ValidateDisease();

});
// THIS EVENT IS USED TO CLICK MEDECINE TO POPUP MEDECINE ID
$(document).on("click", ".medicine", function () {
    let id = $(this).data("id");
    alert("You clicked Medicine ID: " + id);
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
        $('#tblDisWiseMed').DataTable({
            data: tbldata,
            "responsive": true,
            "bDestroy": true,
            columns: [
                { "data": "SL" },
                { data: 'DiseaseId' },
                { data: 'DiseaseName' },
                { data: 'DiseaseNameBN' },
                { data: 'DiseaseDescriptions' },                
                { data: 'IsActive' },
                {
                    data: null,
                    render: function (data, type, row) {
                        
                        return '<button id="btnEdit" name="btnEdit" type="button" title="Edit" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="DiseaseHelper.GetDiseaseID(\'' + row.DiseaseId + '\')" class="btn btn-sm btn-danger"> <i class="fa fa-pencil" style="font-size:15px; padding:0px;"></i></button><button id="btnDetails" name="btnDetails" type="button" title="Details" style="margin-right:2px; width:20px; height:20px; padding:0px;" onclick="DiseaseHelper.GetDetailsByDiseaseID(\'' + row.DiseaseId + '\')" class="btn btn-sm btn-warning"> <i class="fa fa-eye" style="font-size:15px; padding:0px;"></i></button>';
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
                DiseaseNameBN: $('#txtDiseaseNameBN').val(),
                DiseaseDescriptions: $('#txtDiseaseDescriptions').val(),
                DiseaseDescriptionsBN: $('#txtDiseaseDescriptionsBN').val(),
                MedicinesID: $('#cmbMedicines').val() ? $('#cmbMedicines').val().join(',') : '',                
                MedicineNames:'0',                
                MedicineNamesBN:'0',                
                Advice: $('#txtAdvice').val(),                
                AdviceBN: $('#txtAdviceBN').val(),                
                UsageRules: $('#txtUsageRules').val(),                
                UsageRulesBN: $('#txtUsageRulesBN').val(),                
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
                DiseaseNameBN: $('#txtDiseaseNameBN').val(),
                DiseaseDescriptions: $('#txtDiseaseDescriptions').val(),
                DiseaseDescriptionsBN: $('#txtDiseaseDescriptionsBN').val(),
                MedicinesID: $('#cmbMedicines').val() ? $('#cmbMedicines').val().join(',') : '',
                MedicineNames: '0',
                MedicineNamesBN: '0',
                Advice: $('#txtAdvice').val(),
                AdviceBN: $('#txtAdviceBN').val(),
                UsageRules: $('#txtUsageRules').val(),
                UsageRulesBN: $('#txtUsageRulesBN').val(),  
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
                    //console.log(result.data);
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
                    console.log(response.data);
                    $('#txtDiseaseId').val(Disease.DiseaseId);
                    $('#txtDiseaseName').val(Disease.DiseaseName);
                    $('#txtDiseaseNameBN').val(Disease.DiseaseNameBN);
                    $('#txtDiseaseDescriptions').val(Disease.DiseaseDescriptions);
                    $('#txtDiseaseDescriptionsBN').val(Disease.DiseaseDescriptionsBN);
                    if (Disease.MedicinesID) {
                        var selectedValues = Disease.MedicinesID.split(','); // convert string to array
                        $("#cmbMedicines").val(selectedValues).trigger('change'); // bind to select2
                    }

                    $('#txtAdvice').val(Disease.Advice);                                    
                    $('#txtAdviceBN').val(Disease.AdviceBN);  
                    $('#txtUsageRules').val(Disease.UsageRules);  
                    $('#txtUsageRulesBN').val(Disease.UsageRulesBN);
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
                txtUsageRules: "required",
                txtUsageRulesBN: "required",
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
                txtUsageRules: "Usage Rules is required", 
                txtUsageRulesBN: "Usage Rules is required", 
                cmbMedicines: "Please select a valid Medicines",
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
                    $('#mdlTitle').html("Disease Details for: " + Item.DiseaseId + " - " + Item.DiseaseName + " - " + Item.DiseaseNameBN);
                    $('#mdlDiseaseId').html("Disease Id: " + Item.DiseaseId);
                    $('#mdlDiseaseName').html("Disease Name: " + Item.DiseaseName);
                    $('#mdlDiseaseNameBN').html("রোগের নাম: " + Item.DiseaseNameBN);
                    $('#mdlDiseaseDescriptions').html("Disease Descriptions: " + Item.DiseaseDescriptions);
                    $('#mdlDiseaseDescriptionsBN').html("রোগের বর্ণনা: " + Item.DiseaseDescriptionsBN);
                    $('#mdlMedicineNames').html("Medicines: " + Item.MedicineNames);
                    $('#mdlMedicineNamesBN').html("ওষুধগুলো: " + Item.MedicineNamesBN);
                    //if (Item.MedicinesID) {
                    //    var selectedValues = Item.MedicinesID.split(','); // convert string to array
                    //    $("#mdlcmbMedicines").val(selectedValues).trigger('change'); // bind to select2
                    //}                   
                    $('#mdlAdvice').html("Advice: " + Item.Advice);
                    $('#mdlAdviceBN').html("পরামর্শ: " + Item.AdviceBN);
                    $('#mdlUsageRules').html("UsageRules: " + Item.UsageRules);
                    $('#mdlUsageRulesBN').html("ব্যবহারের নিয়ম: " + Item.UsageRulesBN);
                    //$('#mdlIsActive').html("Name: " + Item.IsActive); 
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
        $('#txtUsageRules').html("");
        $('#txtUsageRulesBN').html("");
        $('#CmbIsActive').html("");
    },
};