using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eMedicineWeb.Models
{
    public class LoginViewModel
    {
        public string UserId { get; set; }
        public string Password { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string LocationId { get; set; } = string.Empty;
        public string CityId { get; set; } = string.Empty;
        public string TerminalId { get; set; } = string.Empty;
    }
    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
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
    }
    public class MenuResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<MenuViewModel> Data { get; set; }
    }
}