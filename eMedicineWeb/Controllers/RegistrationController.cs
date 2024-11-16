using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace eMedicineWeb.Controllers
{
    [AllowAnonymous]
    public class RegistrationController : Controller
    {
        DataSet ds = new DataSet();
        public ActionResult UserRegister()
        {
            return View();
        }


        public JsonResult SaveRegistration()
        {

            if (Session["UserID"] == null)
            {
                return new JsonResult { Data = new { status = "Logout" } };
            }
            else
            {
                bool status = false;
         
                if (ds.Tables[0].Rows.Count > 0)
                {
                    status = true;
                }
                else
                {
                    status = false;
                }
                return new JsonResult { Data = new { status = status } };
            }
        }


    }
}