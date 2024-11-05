namespace eMedicine.Models
{
    public class Company
    {
        public string CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyAddress { get; set; } = string.Empty;
        public string CompanyDescription { get; set; } = string.Empty;
        public string CompanyPhone { get; set; } = string.Empty;
        public string CompanyCity { get; set; } = string.Empty;
        public string CompanyRegion { get; set; } = string.Empty;
        public string CompanyPostalCode { get; set; } = string.Empty;
        public string CompanyCountry { get; set; } = string.Empty;
        public string IsActive { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;
        public string CreatedDate { get; set; } = string.Empty;
        public string Updatedby { get; set; } = string.Empty;
        public string DeletedBy { get; set; } = string.Empty;
        public string DeletedDate { get; set; } = string.Empty;


    }
}
