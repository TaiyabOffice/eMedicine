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
        public string? OrderAddress { get; set; }
        public string OrderdDate { get; set; }
    }
    public class OrderList
    {
        public string OrderId { get; set; }
        public string OrderDate { get; set; }
        public string OrderBy { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }       
        public string? CustomerAddress { get; set; }       
        public string Remarks { get; set; }
        public string SalesPersonName { get; set; }
        public string IsDelivered { get; set; }
        public string ItemId { get; set; }
        public string Name { get; set; }
        public string Quantity { get; set; }
        public string UnitPrice { get; set; }
        public string Total { get; set; }
        public string RowId { get; set; }

    }
}
