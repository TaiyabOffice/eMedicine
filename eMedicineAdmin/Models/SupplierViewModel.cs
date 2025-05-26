namespace eMedicineAdmin.Models
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
        public string IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string Updatedby { get; set; }
        public string UpdatedDate { get; set; }
        public List<SupplierViewModel> Data { get; set; } = new List<SupplierViewModel>();
        public bool Success { get; set; }
    }

    public class SalesPersonViewModel
    {
        public string SalesPersonId { get; set; }
        public string SalesPersonName { get; set; }
        public string SalesPersonDescription { get; set; }
        public string SalesPersonPhone { get; set; }
        public string CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string IsActive { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public List<SalesPersonViewModel> Data { get; set; } = new List<SalesPersonViewModel>();
        public bool Success { get; set; }
    }
}
