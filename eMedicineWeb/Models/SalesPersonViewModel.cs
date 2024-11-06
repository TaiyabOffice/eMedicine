using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eMedicineWeb.Models
{
    public class SalesPersonViewModel
    {
        public string SalesPersonId { get; set; }
        public string SalesPersonName { get; set; }
        public string SalesPersonDescription { get; set; }
        public string SalesPersonPhone { get; set; }
        public string CompanyId { get; set; }
        public string IsActive { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
    }
}