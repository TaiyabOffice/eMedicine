namespace eMedicineAdmin.Models
{
    public class LoginViewModel
    {
        public string UserName { get; set; }       
        public string UserId { get; set; }
        public string Password { get; set; }       
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string LocationId { get; set; } = string.Empty;
        public string CityId { get; set; } = string.Empty;
        public string TerminalId { get; set; } = string.Empty;
        public string IsActive { get; set; }
        public List<LoginViewModel> Data { get; set; } = new List<LoginViewModel>();
    }

    public class MenuViewModel
    {
        public string MenuID { get; set; }
        public string ParentID { get; set; }
        public string MenuName { get; set; }
        public string PageName { get; set; }
        public string PageUrl { get; set; }
        public string MenuSequenceNo { get; set; }
        public List<MenuViewModel> Data { get; set; } = new List<MenuViewModel>();
        public bool Success { get; set; }
    }
    public class RegistrationViewModel
    {
        public string PhoneNumber { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string DistrictId { get; set; }
        public string DistrictName { get; set; }
        public string UpazilasId { get; set; }
        public string UpazilasName { get; set; }
        public string IsActive { get; set; }
        public List<RegistrationViewModel> Data { get; set; } = new List<RegistrationViewModel>();
        public bool Success { get; set; }
        
    }
    public class DropdownListViewModel
    {
        public string procedureName { get; set; }
        public string callName { get; set; }
        public string param1 { get; set; }
        public string param2 { get; set; }
        public string param3 { get; set; }
        public string param4 { get; set; }
        public string param5 { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public List<DropdownListViewModel> Data { get; set; } = new List<DropdownListViewModel>();
        public bool Success { get; set; }
    }
}
