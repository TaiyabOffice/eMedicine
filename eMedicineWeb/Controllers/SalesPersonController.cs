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
    public class SalesPersonController : Controller
    {
        // GET: SalesPerson  
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"] + "SalesPersonAPI");
        HttpClient client;        
        public SalesPersonController()
        {
            client = new HttpClient();
            client.BaseAddress = baseAddress;

        }
        public ActionResult UIEntrySalesPerson()
        {
            return View();
        }

        public async Task<ActionResult> GetAllSalesPerson()
        {
            List<SalesPersonViewModel> salesPersonList = new List<SalesPersonViewModel>();

            try
            {               
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetAllSalesPerson");
                
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<SalesPersonResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            salesPersonList = Response?.Data ?? new List<SalesPersonViewModel>();
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
            return Json(new { success = true, data = salesPersonList }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public async Task<ActionResult> CreateSalesPerson(SalesPersonViewModel salesPerson)
        {
            bool Satus = false;
            if (!ModelState.IsValid)
            {
                return View(salesPerson);
            }
            string data = JsonConvert.SerializeObject(salesPerson);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateSalesPerson", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Sales Person create Successfully" });
            }
            ModelState.AddModelError("", "Unable to create Sales Person. Please try again.");
            return Json(new { success = false, message = "Failed to retrieve Sales Person details." });
        }
        [HttpPost]
        public async Task<JsonResult> GetSalesPersonById(string salesPersonId)
        {
            SalesPersonViewModel salesPerson = null;
            try
            {
                HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetSalesPersonById/" + salesPersonId).Result;
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    try
                    {
                        salesPerson = JsonConvert.DeserializeObject<SalesPersonViewModel>(data);
                    }
                    catch (JsonSerializationException)
                    {
                        var salesPersons = JsonConvert.DeserializeObject<List<SalesPersonViewModel>>(data);
                        salesPerson = salesPersons.FirstOrDefault();
                    }

                    if (salesPerson != null)
                    {
                        return Json(new { success = true, data01 = new List<SalesPersonViewModel> { salesPerson } });
                    }
                }
                return Json(new { success = false, message = "Failed to retrieve Sales Person details." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<ActionResult> UpdateSalesPersonById(SalesPersonViewModel salesPerson)
        {
            bool Satus = false;
            if (!ModelState.IsValid)
            {
                return View(salesPerson);
            }
            string data = JsonConvert.SerializeObject(salesPerson);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/UpdateSalesPersonById", content);
            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Sales Person Update Successfully" });
            }
            ModelState.AddModelError("", "Unable to Update Sales Person. Please try again.");
            return Json(new { success = false, message = "Failed to retrieve Sales Person details." });
        }
    }
}