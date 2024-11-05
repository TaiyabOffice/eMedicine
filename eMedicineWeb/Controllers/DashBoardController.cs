using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace eMedicineWeb.Controllers
{
    public class DashBoardController : Controller
    {
        // GET: DashBoard
        public ActionResult DashBoard()
        {
            return View();
        }
    }
}