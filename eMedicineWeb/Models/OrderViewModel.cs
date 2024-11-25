using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eMedicineWeb.Models
{
    public class OrderViewModel
    {
        public string Id { get; set; }       // Product ID
        public string Name { get; set; } // Product Name
        public string Price { get; set; } // Price per unit
        public string Quantity { get; set; }
    }
    public class OrderResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<OrderViewModel> Data { get; set; }
    }
}