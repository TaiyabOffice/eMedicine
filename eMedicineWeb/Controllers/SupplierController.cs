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
    public class SupplierController : Controller
    {
        // GET: Supplier
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"] + "SupplierAPI");
        HttpClient client;
        public SupplierController()
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

        public ActionResult UIEntrySupplier()
        {
            return View();
        }
        public async Task<ActionResult> GetAllSupplier()
        {
            List<SupplierViewModel> SupplierList = new List<SupplierViewModel>();

            try
            {
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetAllSupplier");

                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<SupplierResponse>(data);                   
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {                          
                            SupplierList = Response?.Data ?? new List<SupplierViewModel>();
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
            return Json(new { success = true, data = SupplierList }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public async Task<ActionResult> CreateSupplier(SupplierViewModel Supplier)
        {
           
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Supplier details." });
            }
            string data = JsonConvert.SerializeObject(Supplier);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateSupplier", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Supplier create Successfully" });
            }
            ModelState.AddModelError("", "Unable to create Supplier. Please try again.");
            return Json(new { success = false, message = "Failed to retrieve Supplier details." });
        }
        [HttpPost]
        public async Task<JsonResult> GetSupplierById(string SupplierId)
        {
            SupplierViewModel Supplier = null;
            try
            {
                HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetSupplierById/" + SupplierId).Result;
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<SupplierResponse>(data);                   
                    if (Response.Success)
                    {
                        try
                        {
                            //Supplier = JsonConvert.DeserializeObject<SupplierViewModel>(data);
                            //Supplier = Response?.Data ?? new SupplierViewModel();

                            var Suppliers = Response?.Data ?? new List<SupplierViewModel>();
                            Supplier = Suppliers.FirstOrDefault();
                        }
                        catch (JsonSerializationException)
                        {
                            var Suppliers = JsonConvert.DeserializeObject<List<SupplierViewModel>>(data);
                            Supplier = Suppliers.FirstOrDefault();
                        }
                    }
                    else
                    {
                        return Json(new { success = false, message = "Failed to retrieve Supplier details." }, JsonRequestBehavior.AllowGet);
                    }

                    if (Supplier != null)
                    {                     
                        return Json(new { Success = true, data = Supplier }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { Success = false, message = "Failed to retrieve Supplier details." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<ActionResult> UpdateSupplierById(SupplierViewModel Supplier)
        {
            bool Satus = false;
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Supplier details." });
            }
            string data = JsonConvert.SerializeObject(Supplier);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/UpdateSupplierById", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Supplier update Successfully" });
            }
            ModelState.AddModelError("", "Unable to update Supplier. Please try again.");
            return Json(new { success = false, message = "Failed to retrieve Supplier details." });
        }
    }
}