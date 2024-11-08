namespace eMedicine.Models
{
    public class Company
    {
        public string CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyAddress { get; set; } = string.Empty;
        public string CompanyDescription { get; set; } = string.Empty;
        public string CompanyPhone { get; set; } = string.Empty;
        public string IsActive { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = "000000";
        public string CreatedDate { get; set; } = DateTime.Now.ToString("dd-MMM-yy");
        public string Updatedby { get; set; } = "000000";
        public string UpdatedDate { get; set; } = DateTime.Now.ToString("dd-MMM-yy");


    }
}
