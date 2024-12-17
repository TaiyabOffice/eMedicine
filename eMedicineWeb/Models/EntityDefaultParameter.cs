using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eMedicineWeb.Models
{
    public class EntityDefaultParameter
    {
        public string COMC1 { get; set; }
        public string PROCNAME { get; set; }
        public string CALLTYPE { get; set; }
        public string DESC1 { get; set; }
        public string DESC2 { get; set; }
        public string DESC3 { get; set; }
        public string DESC4 { get; set; }
        public string DESC5 { get; set; }
        public string DESC6 { get; set; }
        public string DESC7 { get; set; }
        public string DESC8 { get; set; }
        public string DESC9 { get; set; }
        public string DESC10 { get; set; }
        public string DESC11 { get; set; }
        public string DESC12 { get; set; }
        public string DESC13 { get; set; }
        public string DESC14 { get; set; }
        public string DESC15 { get; set; }
        public string DESC16 { get; set; }
        public string DESC17 { get; set; }
        public string DESC18 { get; set; }
        public string DESC19 { get; set; }
        public string DESC20 { get; set; }
        public string DESC21 { get; set; }
        public string DESC22 { get; set; }
        public string DESC23 { get; set; }
        public string DESC24 { get; set; }
        public string DESC25 { get; set; }
        public string DESC26 { get; set; }
        public string DESC27 { get; set; }
        public string DESC28 { get; set; }
        public string DESC29 { get; set; }
        public string DESC30 { get; set; }
    }
    public class EntityDefaultResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<EntityDefaultParameter> Data { get; set; }
    }
}