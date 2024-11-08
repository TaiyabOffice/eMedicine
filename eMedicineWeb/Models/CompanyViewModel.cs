using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eMedicineWeb.Models
{
    public class CompanyViewModel
    {
        public string CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyAddress { get; set; } = string.Empty;
        public string CompanyDescription { get; set; } = string.Empty;
        public string CompanyPhone { get; set; } = string.Empty;
        public string IsActive { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;
        public string CreatedDate { get; set; } = string.Empty;
        public string Updatedby { get; set; } = string.Empty;
        public string UpdatedDate { get; set; } = string.Empty;
    }
    public class CompanyResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<CompanyViewModel> Data { get; set; }
    }
}