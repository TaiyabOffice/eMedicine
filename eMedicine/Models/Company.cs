namespace eMedicine.Models
{
    public class Company
    {
        public string CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyAddress { get; set; } = string.Empty;
        public string CompanyDescription { get; set; } = string.Empty;
        public string CompanyNameBN { get; set; } = string.Empty;
        public string CompanyAddressBN { get; set; } = string.Empty;
        public string CompanyDescriptionBN { get; set; } = string.Empty;
        public string CompanyPhone { get; set; } = string.Empty;
        public string ImagePath { get; set; }        
        public string IsActive { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;
        public string CreatedDate { get; set; } = string.Empty;
        public string Updatedby { get; set; } = string.Empty;
        public string UpdatedDate { get; set; } = string.Empty;
    }
    //public class CompanyResponse
    //{
    //    public bool Success { get; set; }
    //    public string Message { get; set; }
    //    public List<Company> Data { get; set; }
    //}
}
