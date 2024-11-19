using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eMedicineWeb.Models
{
    public class RegistrationViewModel
    {
        public string PhoneNumber { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string DistrictId { get; set; }
        public string UpazilasId { get; set; }
        public string IsActive { get; set; }
    }

    public class RegistrationResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string RedirectUrl { get; set; }
        public List<RegistrationViewModel> Data { get; set; }
    }
}