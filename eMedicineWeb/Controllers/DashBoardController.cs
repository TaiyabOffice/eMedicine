using eMedicineWeb.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace eMedicineWeb.Controllers
{
    public class DashBoardController : Controller
    {
        // GET: DashBoard

        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"] + "DashBoardAPI");
        HttpClient client;
        public DashBoardController()
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
        public ActionResult DashBoard()
        {
            return View();
        }
        public async Task<JsonResult> GetDashBoardDetails()
        {
            List<EntityDefaultParameter> DashBoard = new List<EntityDefaultParameter>();
            try
            {
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetDashBoardDetails");
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<EntityDefaultResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            DashBoard = Response?.Data ?? new List<EntityDefaultParameter>();
                        }
                    }
                }
                else
                {
                    return Json(new { Success = false, message = "Failed to retrieve DashBoard. Please try again later." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { Success = true, data = DashBoard }, JsonRequestBehavior.AllowGet);
        }
    }
}