using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eMedicineWeb.Models
{
    public class DropdownListViewModel
    {
        public string procedureName { get; set; }
        public string callName { get; set; }
        public string param1 { get; set; }
        public string param2 { get; set; }
        public string param3 { get; set; }
        public string param4 { get; set; }
        public string param5 { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
    }
    public class DropdownListResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<DropdownListViewModel> Data { get; set; }
    }
}