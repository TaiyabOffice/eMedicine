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
        public string? Profession { get; set; }
        public string IsActive { get; set; }        
    }

    public class Contact
    {
        public string? ShopName { get; set; }
        public string? ShopNameBN { get; set; }
        public string? ContactPerson { get; set; }
        public string? ShopAddress { get; set; }
        public string? ShopAddressBN { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }      
        public string? DistrictName { get; set; }    
        public string? DistrictNameBN { get; set; }    
        public string? UpazilaName { get; set; }
        public string? UpazilaNameBN { get; set; }
        public string? IsActive { get; set; }
    }
}
