using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eMedicineWeb.Models
{
    public class SupplierViewModel
    {
        public string SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string ContactPerson { get; set; }
        public string SupplierPhone { get; set; }
        public string CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string Email { get; set; }
        public string CompanyCity { get; set; }        
        public string IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string Updatedby { get; set; }
        public string UpdatedDate { get; set; }
       
    }
}