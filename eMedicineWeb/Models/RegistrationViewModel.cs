using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eMedicineWeb.Models
{
    public class RegistrationViewModel
    {
        public string PhoneNo { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string Updatedby { get; set; }
        public string UpdatedDate { get; set; }
    }

    public class RegistrationResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<RegistrationViewModel> Data { get; set; }
    }
}