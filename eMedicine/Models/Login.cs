namespace eMedicine.Models
{
    public class Login
    {
        public string UserId { get; set; }
        public string UserPassword { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty; 
        public string LocationId { get; set; } = string.Empty;
        public string CityId { get; set; } = string.Empty;
        public string TerminalId { get; set; } = string.Empty;
    }

    public class Menu
    {
        public string MenuID { get; set; }
        public string ParentID { get; set; }
        public string MenuName { get; set; }
        public string MenuNameBN { get; set; }
        public string PageName { get; set; }
        public string PageUrl { get; set; }
        public string MenuSequenceNo { get; set; }
        public string ImagePath { get; set; }
    }
}
