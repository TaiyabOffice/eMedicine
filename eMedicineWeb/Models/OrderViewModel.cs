using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eMedicineWeb.Models
{
    public class OrderViewModel
    {
        public string OrderId { get; set; }
        public string ItemId { get; set; }
        public string Name { get; set; }
        public string Quantity { get; set; }
        public string UnitPrice { get; set; }
        public string OrderdBy { get; set; }
        public string OrderdDate { get; set; }
    }
    public class OrderResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<OrderViewModel> Data { get; set; }
    }
}