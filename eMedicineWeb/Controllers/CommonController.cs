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
        private DataSet ds;
        public DataSet MenuData = new DataSet();
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"] + "CommonAPI");
        HttpClient client;
        public CommonController()
        {
            client = new HttpClient();
            client.BaseAddress = baseAddress;

        }
        public ActionResult GenerateCombo(string ProcedureName, string CallName, string Param1, string Param2, string Param3, string Param4, string Param5)
        {
            bool status = false;
            DropdownListViewModal dropdownList = null;
            string requestUrl = $"{client.BaseAddress}/GetDropdownList?ProcedureName={Uri.EscapeDataString(ProcedureName)}&CallName={Uri.EscapeDataString(CallName)}&Param1={Uri.EscapeDataString(Param1)}&Param2={Uri.EscapeDataString(Param2)}&Param3={Uri.EscapeDataString(Param3)}&Param4={Uri.EscapeDataString(Param4)}&Param5={Uri.EscapeDataString(Param5)}";

            HttpResponseMessage response = client.GetAsync(requestUrl).Result;

            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                try
                {
                    var dropdownModal = JsonConvert.DeserializeObject<List<DropdownListViewModal>>(data);                   
                    return Json(dropdownModal, JsonRequestBehavior.AllowGet);
                }
                catch (JsonSerializationException)
                {
                    var dropdownModal = JsonConvert.DeserializeObject<List<DropdownListViewModal>>(data);
                    dropdownList = dropdownModal.FirstOrDefault();
                }
            }

            return Json(status, JsonRequestBehavior.AllowGet);
        }

        public string GetCurrentDate()
        {
            return DateTime.Now.ToString();
        }

    }
}