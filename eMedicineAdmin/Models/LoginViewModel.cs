namespace eMedicineAdmin.Models
{
    public class LoginViewModel
    {
        public string UserName { get; set; }
        public string UserPassword { get; set; }
        public string UserId { get; set; }
        public string Password { get; set; }       
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string LocationId { get; set; } = string.Empty;
        public string CityId { get; set; } = string.Empty;
        public string TerminalId { get; set; } = string.Empty;
        public List<LoginViewModel> Data { get; set; }
    }

    public class MenuViewModel
    {
        public string MenuID { get; set; }
        public string ParentID { get; set; }
        public string MenuName { get; set; }
        public string PageName { get; set; }
        public string PageUrl { get; set; }
        public string MenuSequenceNo { get; set; }
        public List<MenuViewModel> Data { get; set; }
    }
}
