//BaseUrl = "https://192.168.100.79:45459/api/";
BaseUrl = "https://api.emedicinebd.com/api/";

var ApiLink = {
    BaseUrl: "https://192.168.100.79:45459/",
    GetAllSupplier: BaseUrl + "SupplierAPI/GetAllSupplier",
    GetSupplierById: BaseUrl + "SupplierAPI/GetSupplierById",    
    GetComboData: BaseUrl + "CommonAPI/GetDropdownList",
    SaveTemplateData: BaseUrl + "ProjectCompletionAPI/SaveTemplateData",
    SaveTypeData: BaseUrl + "ProjectCompletionAPI/SaveTypeData",
    GetActionPlan: BaseUrl + "ProjectCompletionAPI/GetActionPlan",
    GetDetailsByCellId: BaseUrl + "ProjectCompletionAPI/GetDetailsByCellId",
    SaveExecutionData: BaseUrl + "ProjectCompletionAPI/SaveExecutionData",
    GetExecutionList: BaseUrl + "ProjectCompletionAPI/GetExecutionList",
    GetExecutionDetailsByRowId: BaseUrl + "ProjectCompletionAPI/GetExecutionDetailsByRowId",
    SaveResponsibilitiesData: BaseUrl + "ProjectCompletionAPI/SaveResponsibilitiesData",
    loadConversation: BaseUrl + "ProjectCompletionAPI/loadConversation",
    SendConversationData: BaseUrl + "ProjectCompletionAPI/SendConversationData",
    GetTemplateDetailForProj: BaseUrl + "ProjectCompletionAPI/GetTemplateDetailForProj",
    SaveProjTemplateData: BaseUrl + "ProjectCompletionAPI/SaveProjTemplateData",
    GetProjTempForUpdate: BaseUrl + "ProjectCompletionAPI/GetProjTempForUpdate",
    UpdateProjTemplateData: BaseUrl + "ProjectCompletionAPI/UpdateProjTemplateData",
    SaveAttachmentData: BaseUrl + "ProjectCompletionAPI/SaveAttachmentData",
    GetDashboardData: BaseUrl + "ProjectCompletionAPI/GetDashboardData",
    GetResponsiblePersonList: BaseUrl + "ProjectCompletionAPI/GetResponsiblePersonList",
    GetProjPersonReport: BaseUrl + "CommonAPI/GetProjPersonReport"
};