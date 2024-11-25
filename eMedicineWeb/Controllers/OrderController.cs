using eMedicineWeb.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace eMedicineWeb.Controllers
{
    public class OrderController : Controller
    {
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"] + "OrderAPI");
        HttpClient client;
        public OrderController()
        {
            client = new HttpClient();
            client.BaseAddress = baseAddress;

        }
        // GET: Order
        public ActionResult UIEntryOrder()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> SaveOrderList(List<OrderViewModel> OrderItems)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Brand details." });
            }
            foreach (var item in OrderItems)
            {
                string data = JsonConvert.SerializeObject(item);
                StringContent content = new StringContent(data, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/SaveOrder", content);

                if (response.IsSuccessStatusCode)
                {
                    return Json(new { success = true, message = "Brand create Successfully" });
                }
            }
            
            ModelState.AddModelError("", "Unable to create Brand. Please try again.");
            return Json(new { success = false, message = "Failed to retrieve Brand details." });
        }

        public async Task<ActionResult> GetItems(string item)
        {
            List<ItemViewModel> ItemList = new List<ItemViewModel>();

            try
            {              
                HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetItems/" + item).Result;

                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<ItemResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            ItemList = Response?.Data ?? new List<ItemViewModel>();
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
            return Json(new { success = true, data = ItemList }, JsonRequestBehavior.AllowGet);
        }
    }
}