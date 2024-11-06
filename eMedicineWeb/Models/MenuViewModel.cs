using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eMedicineWeb.Models
{
    public class MenuViewModel
    {
        public string MenuID { get; set; }
        public string ParentID { get; set; }
        public string MenuName { get; set; }
        public string PageName { get; set; }
        public string PageUrl { get; set; }
        public string MenuSequenceNo { get; set; }
    }
}