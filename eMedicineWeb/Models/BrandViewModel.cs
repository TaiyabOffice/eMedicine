using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eMedicineWeb.Models
{
    public class BrandViewModel
    {
        public string BrandId { get; set; }
        public string BrandName { get; set; }
        public string BrandNameBN { get; set; }
        public string CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string GenericId { get; set; }
        public string GenericName { get; set; }
        public string CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string DosageForm { get; set; }
        public string DosageFormBN { get; set; }
        public string Strength { get; set; }
        public string StrengthBN { get; set; }
        public string BrandDescription { get; set; }
        public string BrandDescriptionBN { get; set; }
        public string IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string Updatedby { get; set; }
        public string UpdatedDate { get; set; }
    }
    public class BrandResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<BrandViewModel> Data { get; set; }
    }
}