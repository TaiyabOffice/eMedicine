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
}