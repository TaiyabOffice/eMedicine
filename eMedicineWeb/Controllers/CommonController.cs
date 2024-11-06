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
            DropdownListViewModel dropdownList = null;
            string requestUrl = $"{client.BaseAddress}/GetDropdownList?ProcedureName={ProcedureName}&CallName={CallName}&Param1={Param1}&Param2={Param2}&Param3={Param3}&Param4={Param4}&Param5={Param5}";

            HttpResponseMessage response = client.GetAsync(requestUrl).Result;

            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                try
                {
                    var dropdownModal = JsonConvert.DeserializeObject<List<DropdownListViewModel>>(data);                   
                    return Json(dropdownModal, JsonRequestBehavior.AllowGet);
                }
                catch (JsonSerializationException)
                {
                    var dropdownModal = JsonConvert.DeserializeObject<List<DropdownListViewModel>>(data);
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