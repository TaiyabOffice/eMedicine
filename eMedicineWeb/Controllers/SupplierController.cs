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
        public ActionResult Index()
        {
            return View();
        }

        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"] + "SupplierAPI");
        HttpClient client;
        public SupplierController()
        {
            client = new HttpClient();
            client.BaseAddress = baseAddress;

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

                    if (!string.IsNullOrEmpty(data))
                    {
                        SupplierList = JsonConvert.DeserializeObject<List<SupplierViewModel>>(data);
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Failed to retrieve sales Person. Please try again later." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
            return Json(new { success = true, data = SupplierList }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public async Task<ActionResult> CreateSupplier(SupplierViewModel Supplier)
        {
            bool Satus = false;
            if (!ModelState.IsValid)
            {
                return View(Supplier);
            }
            string data = JsonConvert.SerializeObject(Supplier);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateSupplier", content);
            if (response.IsSuccessStatusCode)
            {
                return View(Satus = true);
            }
            ModelState.AddModelError("", "Unable to create Supplier. Please try again.");
            return View(Supplier);
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
                    try
                    {
                        Supplier = JsonConvert.DeserializeObject<SupplierViewModel>(data);
                    }
                    catch (JsonSerializationException)
                    {
                        var Suppliers = JsonConvert.DeserializeObject<List<SupplierViewModel>>(data);
                        Supplier = Suppliers.FirstOrDefault();
                    }

                    if (Supplier != null)
                    {
                        return Json(new { success = true, data01 = new List<SupplierViewModel> { Supplier } });
                    }
                }
                return Json(new { success = false, message = "Failed to retrieve Supplier details." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<ActionResult> UpdateSupplierById(SupplierViewModel Supplier)
        {
            bool Satus = false;
            if (!ModelState.IsValid)
            {
                return View(Supplier);
            }
            string data = JsonConvert.SerializeObject(Supplier);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/UpdateSupplierById", content);
            if (response.IsSuccessStatusCode)
            {
                return View(Satus = true);
            }
            ModelState.AddModelError("", "Unable to create Supplier. Please try again.");
            return View(Supplier);
        }
    }
}