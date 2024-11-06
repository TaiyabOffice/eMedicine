using eMedicineWeb.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;

namespace eMedicineWeb.Controllers
{
    public class CommonController : Controller
    {
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"] + "CommonAPI");
        //static string _ServerURL = ConfigurationManager.AppSettings["ServerURL"];
        HttpClient client;
        public ActionResult GenerateCombo(string ProcedureName, string CallName, string Param1, string Param2, string Param3, string Param4, string Param5)
        {
            bool status = false;           
            LoginViewModel loginModel = null;
            string requestUrl = $"{client.BaseAddress}/GetDropdownList?ProcedureName={Uri.EscapeDataString(ProcedureName)}&CallName={Uri.EscapeDataString(CallName)}&Param1={Uri.EscapeDataString(Param1)}&Param2={Uri.EscapeDataString(Param2)}&Param3={Uri.EscapeDataString(Param3)}&Param4={Uri.EscapeDataString(Param4)}&Param5={Uri.EscapeDataString(Param5)}";

            HttpResponseMessage response = client.GetAsync(requestUrl).Result;

            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                try
                {
                    var loginViewModels = JsonConvert.DeserializeObject<List<LoginViewModel>>(data);
                    loginModel = loginViewModels.FirstOrDefault();
                    return Json(loginModel, JsonRequestBehavior.AllowGet);
                }
                catch (JsonSerializationException)
                {

                    var loginViewModels = JsonConvert.DeserializeObject<List<LoginViewModel>>(data);
                    loginModel = loginViewModels.FirstOrDefault();
                }
            }

            return Json(status, JsonRequestBehavior.AllowGet);
        }

    }
}