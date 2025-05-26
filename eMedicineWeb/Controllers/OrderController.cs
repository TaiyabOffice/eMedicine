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
                return Json(new { success = false, message = "Failed to validate input." });
            }
            string data = JsonConvert.SerializeObject(OrderItems);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");
            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/SaveOrders", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Order create Successfully" });
            }

            ModelState.AddModelError("", "Unable to create one or more orders. Please try again.");
            return Json(new { success = false, message = "Failed to save orders." });
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
                    return Json(new { success = false, message = "Failed to retrieve Orders. Please try again later." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { success = true, data = ItemList }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult UIOrderList()
        {
            return View();
        }

        public async Task<ActionResult> GetAllOrders()
        {
            List<OrderListViewModel> OrdersList = new List<OrderListViewModel>();

            try
            {
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetAllOrders");

                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<OrderListResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            OrdersList = Response?.Data ?? new List<OrderListViewModel>();
                        }
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Failed to retrieve Orders. Please try again later." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { success = true, data = OrdersList }, JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult> GetDetailsByOrderID(string OrderId)
        {
            List<OrderListViewModel> OrdersList = new List<OrderListViewModel>();

            try
            {
                HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetDetailsByOrderID/" + OrderId).Result;

                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<OrderListResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            OrdersList = Response?.Data ?? new List<OrderListViewModel>();
                        }
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Failed to retrieve Orders. Please try again later." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { success = true, data = OrdersList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<ActionResult> ConfirmOrders(List<OrderViewModel> OrderItems)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed to validate input." });
            }
            string data = JsonConvert.SerializeObject(OrderItems);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");
            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/ConfirmOrders", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Order Confirm Successfully" });
            }

            ModelState.AddModelError("", "Unable to create one or more orders. Please try again.");
            return Json(new { success = false, message = "Failed to save orders." });
        }

        [HttpPost]
        public async Task<ActionResult> SaveOrderItem(OrderViewModel OrderItem)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed to validate input." });
            }
            string data = JsonConvert.SerializeObject(OrderItem);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");
            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/SaveOrderItem", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Order create Successfully" });
            }

            ModelState.AddModelError("", "Unable to create one or more orders. Please try again.");
            return Json(new { success = false, message = "Failed to save orders." });
        }

        public ActionResult ChangeStatusByOrderID(string OrderId, string statusType)
        {
            bool status = false;
            try
            {
                HttpResponseMessage response = client.GetAsync(client.BaseAddress + $"/ChangeStatusByOrderID/{OrderId}/{statusType}").Result;

                if (response.IsSuccessStatusCode)
                {
                    status = true;

                }
            }
            catch (JsonSerializationException)
            {
                status = false;
            }

            return Json(status, JsonRequestBehavior.AllowGet);
        }

    }
}