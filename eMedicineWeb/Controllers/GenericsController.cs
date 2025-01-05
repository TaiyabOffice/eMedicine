using eMedicineWeb.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace eMedicineWeb.Controllers
{
    public class GenericsController : Controller
    {
        // GET: Generics
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"] + "GenericsAPI");
        HttpClient client;
        public GenericsController()
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

        public ActionResult UIEntryGenerics()
        {
            return View();
        }
        public async Task<ActionResult> GetAllGenerics()
        {
            List<GenericsViewModel> GenericsList = new List<GenericsViewModel>();

            try
            {
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetAllGenerics");

                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<GenericsResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            GenericsList = Response?.Data ?? new List<GenericsViewModel>();
                        }
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Failed to retrieve sales Person. Please try again later." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { success = true, data = GenericsList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<ActionResult> CreateGenerics(GenericsViewModel Generics)
        {

            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Generics details." });
            }
            string data = JsonConvert.SerializeObject(Generics);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateGenerics", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Generics create Successfully" });
            }
            ModelState.AddModelError("", "Unable to create Generics. Please try again.");
            return Json(new { success = false, message = "Failed to retrieve Generics details." });
        }

        [HttpPost]
        public async Task<JsonResult> GetGenericsById(string GenericsId)
        {
            GenericsViewModel Generics = null;
            try
            {
                HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetGenericsById/" + GenericsId).Result;
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<GenericsResponse>(data);
                    if (Response.Success)
                    {
                        try
                        {  
                            var Genericss = Response?.Data ?? new List<GenericsViewModel>();
                            Generics = Genericss.FirstOrDefault();
                        }
                        catch (JsonSerializationException)
                        {
                            var Genericss = JsonConvert.DeserializeObject<List<GenericsViewModel>>(data);
                            Generics = Genericss.FirstOrDefault();
                        }
                    }
                    else
                    {
                        return Json(new { success = false, message = "Failed to retrieve Generics details." }, JsonRequestBehavior.AllowGet);
                    }

                    if (Generics != null)
                    {
                        return Json(new { Success = true, data = Generics }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { Success = false, message = "Failed to retrieve Generics details." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<ActionResult> UpdateGenericsById(GenericsViewModel Generics)
        {
            bool Satus = false;
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Generics details." });
            }
            string data = JsonConvert.SerializeObject(Generics);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/UpdateGenericsById", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Generics update Successfully" });
            }
            ModelState.AddModelError("", "Unable to update Generics. Please try again.");
            return Json(new { success = false, message = "Failed to retrieve Generics details." });
        }
    }
}