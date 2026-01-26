namespace eMedicine.Models
{
    public class SalesPerson
    {
        public string SalesPersonId { get; set; }
        public string SalesPersonName { get; set; }
        public string SalesPersonDescription { get; set; }     
        public string SalesPersonPhone { get; set; }
        public string AreaId { get; set; }
        public string AreaName { get; set; }
        public string CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string IsActive { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }

    }
    public class Shop
    {
        public string ShopId { get; set; }
        public string ShopName { get; set; }
        public string OwnerName { get; set; }
        public string ContactNo { get; set; }
        public string Address { get; set; }
        public string AreaId { get; set; }
        public string AreaName { get; set; }
        public string CreditLimit { get; set; }
        public string DueAmount { get; set; }
        public string IsActive { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
    }
    //public class SalesPersonResponse
    //{
    //    public bool Success { get; set; }
    //    public string Message { get; set; }
    //    public List<Supplier> Data { get; set; }
    //}
}
