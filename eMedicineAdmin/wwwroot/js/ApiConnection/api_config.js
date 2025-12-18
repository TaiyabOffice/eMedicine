//BaseUrl = "https://192.168.100.79:45457/api/";
BaseUrl = "https://api.emedicinebd.com/api/";

var ApiLink = {
    BaseUrl: "https://api.emedicinebd.com/api/",
    GetDropdownList: BaseUrl + "CommonAPI/GetDropdownList",
    GetAllSupplier: BaseUrl + "SupplierAPI/GetAllSupplier",
    GetSupplierById: BaseUrl + "SupplierAPI/GetSupplierById",    
    CreateSupplier: BaseUrl + "SupplierAPI/CreateSupplier",
    UpdateSupplierById: BaseUrl + "SupplierAPI/UpdateSupplierById",

    GetAllSalesPerson: BaseUrl + "SalesPersonAPI/GetAllSalesPerson",  
    CreateSalesPerson: BaseUrl + "SalesPersonAPI/CreateSalesPerson",  
    GetSalesPersonById: BaseUrl + "SalesPersonAPI/GetSalesPersonById",  
    UpdateSalesPersonById: BaseUrl + "SalesPersonAPI/UpdateSalesPersonById", 
    
    GetAllBrand: BaseUrl + "BrandAPI/GetAllBrand",  
    CreateBrand: BaseUrl + "BrandAPI/CreateBrand",  
    GetBrandById: BaseUrl + "BrandAPI/GetBrandById",  
    UpdateBrandById: BaseUrl + "BrandAPI/UpdateBrandById",  
    GetBrandByGenericId: BaseUrl + "BrandAPI/GetBrandByGenericId",  
    GetBrandByCategoryId: BaseUrl + "BrandAPI/GetBrandByCategoryId",  
    GetBrandByCompanyId: BaseUrl + "BrandAPI/GetBrandByCompanyId",
    
    GetAllCompany: BaseUrl + "CompanyAPI/GetAllCompany",  
    CreateCompany: BaseUrl + "CompanyAPI/CreateCompany",  
    GetCompanyById: BaseUrl + "CompanyAPI/GetCompanyById",  
    UpdateCompanyById: BaseUrl + "CompanyAPI/UpdateCompanyById",  

    GetAllGenerics: BaseUrl + "GenericsAPI/GetAllGenerics",  
    CreateGenerics: BaseUrl + "GenericsAPI/CreateGenerics",  
    GetGenericsById: BaseUrl + "GenericsAPI/GetGenericsById",  
    UpdateGenericsById: BaseUrl + "GenericsAPI/UpdateGenericsById",  

    GetAllItem: BaseUrl + "ItemAPI/GetAllItem",  
    CreateItem: BaseUrl + "ItemAPI/CreateItem",  
    GetItemById: BaseUrl + "ItemAPI/GetItemById",  
    UpdateItemById: BaseUrl + "ItemAPI/UpdateItemById",  
    CreateOffer: BaseUrl + "ItemAPI/CreateOffer",  
    GetAllIOffers: BaseUrl + "ItemAPI/GetAllIOffers",  
    GetOfferById: BaseUrl + "ItemAPI/GetOfferById",  
    UpdateOfferById: BaseUrl + "ItemAPI/UpdateOfferById",  
    AddOfferItems: BaseUrl + "ItemAPI/AddOfferItems",  
    SaveOfferItems: BaseUrl + "ItemAPI/SaveOfferItems",  
    GetItemsByOfferId: BaseUrl + "ItemAPI/GetItemsByOfferId",  
    GetItemsByBrandId: BaseUrl + "ItemAPI/GetItemsByBrandId",  
    GetTopItems: BaseUrl + "ItemAPI/GetTopItems",  
    GetItemsByItemId: BaseUrl + "ItemAPI/GetItemsByItemId", 
    
    GetAllDisease: BaseUrl + "ItemAPI/GetAllDisease",  
    CreateDiseaseData: BaseUrl + "ItemAPI/CreateDiseaseData",  
    GetDiseaseById: BaseUrl + "ItemAPI/GetDiseaseById",  
    UpdateDiseaseById: BaseUrl + "ItemAPI/UpdateDiseaseById",
    
    SaveOrders: BaseUrl + "OrderAPI/SaveOrders",  
    GetItems: BaseUrl + "OrderAPI/GetItems",  
    GetAllOrders: BaseUrl + "OrderAPI/GetAllOrders",  
    GetDetailsByOrderID: BaseUrl + "OrderAPI/GetDetailsByOrderID",  
    ConfirmOrders: BaseUrl + "OrderAPI/ConfirmOrders",  
    SaveOrderItem: BaseUrl + "OrderAPI/SaveOrderItem",  
    ChangeStatusByOrderID: BaseUrl + "OrderAPI/ChangeStatusByOrderID",  
    GetDetailsByUserID: BaseUrl + "OrderAPI/GetDetailsByUserID",
    
    CreateRegistration: BaseUrl + "RegistrationAPI/CreateRegistration",  
    GetAllUser: BaseUrl + "RegistrationAPI/GetAllUser",  
    UpdateUserById: BaseUrl + "RegistrationAPI/UpdateUserById",  
    RecoverPassword: BaseUrl + "RegistrationAPI/RecoverPassword",  
    GetContactDetails: BaseUrl + "RegistrationAPI/GetContactDetails",  

    PrintReportData: BaseUrl + "ReportAPI/PrintReportData" 
    
};