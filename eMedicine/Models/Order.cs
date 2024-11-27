namespace eMedicine.Models
{
    public class Order
    {
        public string OrderId { get; set; }      
        public string ItemId { get; set; }      
        public string Name { get; set; } 
        public string Quantity { get; set; } 
        public string UnitPrice { get; set; } 
        public string OrderdBy { get; set; }
        public string OrderdDate { get; set; }
    }
}
