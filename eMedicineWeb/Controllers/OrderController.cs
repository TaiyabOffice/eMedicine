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
    }
}