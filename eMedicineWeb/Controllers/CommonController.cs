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
            var userAgent = ConfigurationManager.AppSettings["UserAgent"];
            var acceptHeader = ConfigurationManager.AppSettings["AcceptHeader"];
            client = new HttpClient
            {
                BaseAddress = baseAddress
            };
            if (!string.IsNullOrEmpty(userAgent))
            {
                client.DefaultRequestHeaders.Add("User-Agent", userAgent);
            }
            if (!string.IsNullOrEmpty(acceptHeader))
            {
                client.DefaultRequestHeaders.Add("Accept", acceptHeader);
            }

        }
        public ActionResult GenerateCombo(string ProcedureName, string CallName, string Param1, string Param2, string Param3, string Param4, string Param5)
        {
            bool status = false;
            List<DropdownListViewModel> dropdownList = new List<DropdownListViewModel>();
            try
            {
                string requestUrl = $"{client.BaseAddress}/GetDropdownList?ProcedureName={ProcedureName}&CallName={CallName}&Param1={Param1}&Param2={Param2}&Param3={Param3}&Param4={Param4}&Param5={Param5}";

                HttpResponseMessage response = client.GetAsync(requestUrl).Result;

                if (response.IsSuccessStatusCode)
                {
                    string data = response.Content.ReadAsStringAsync().Result;
                    var Response = JsonConvert.DeserializeObject<DropdownListResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            dropdownList = Response?.Data ?? new List<DropdownListViewModel>();
                        }
                    }                    
                }
                else
                {
                    return Json(new { Success = false, message = "Failed to retrieve dropdown List. Please try again later." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { Success = true, data = dropdownList }, JsonRequestBehavior.AllowGet);
        }

        public string GetCurrentDate()
        {
            return DateTime.Now.ToString();
        }

    }
}