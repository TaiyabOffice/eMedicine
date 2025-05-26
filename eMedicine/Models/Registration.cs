namespace eMedicine.Models
{
    public class Registration
    {
        public string PhoneNumber { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string DistrictId { get; set; }
        public string DistrictName { get; set; }
        public string UpazilasId { get; set; }
        public string UpazilasName { get; set; }
        public string IsActive { get; set; }        
    }
}
