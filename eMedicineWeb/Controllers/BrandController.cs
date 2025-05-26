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
    public class BrandController : Controller
    {
        // GET: Brand
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"] + "BrandAPI");
        HttpClient client;
        public BrandController()
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

        public ActionResult UIEntryBrand()
        {
            return View();
        }
        public async Task<ActionResult> GetAllBrand()
        {
            List<BrandViewModel> BrandList = new List<BrandViewModel>();

            try
            {
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetAllBrand");

                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<BrandResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            BrandList = Response?.Data ?? new List<BrandViewModel>();
                        }
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Failed to retrieve Brand. Please try again later." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { success = true, data = BrandList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<ActionResult> CreateBrand(BrandViewModel Brand)
        {

            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Brand details." });
            }
            string data = JsonConvert.SerializeObject(Brand);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateBrand", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Brand create Successfully" });
            }
            ModelState.AddModelError("", "Unable to create Brand. Please try again.");
            return Json(new { success = false, message = "Failed to retrieve Brand details." });
        }

        [HttpPost]
        public async Task<JsonResult> GetBrandById(string BrandId)
        {
            BrandViewModel Brand = null;
            try
            {
                HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetBrandById/" + BrandId).Result;
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<BrandResponse>(data);
                    if (Response.Success)
                    {
                        try
                        {
                            var Brands = Response?.Data ?? new List<BrandViewModel>();
                            Brand = Brands.FirstOrDefault();
                        }
                        catch (JsonSerializationException)
                        {
                            var Brands = JsonConvert.DeserializeObject<List<BrandViewModel>>(data);
                            Brand = Brands.FirstOrDefault();
                        }
                    }
                    else
                    {
                        return Json(new { success = false, message = "Failed to retrieve Brand details." }, JsonRequestBehavior.AllowGet);
                    }

                    if (Brand != null)
                    {
                        return Json(new { Success = true, data = Brand }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { Success = false, message = "Failed to retrieve Brand details." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<ActionResult> UpdateBrandById(BrandViewModel Brand)
        {
           
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Brand details." });
            }
            string data = JsonConvert.SerializeObject(Brand);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/UpdateBrandById", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Brand update Successfully" });
            }
            ModelState.AddModelError("", "Unable to update Brand. Please try again.");
            return Json(new { success = false, message = "Failed to retrieve Brand details." });
        }
    }
}