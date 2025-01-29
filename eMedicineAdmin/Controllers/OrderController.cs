using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using eMedicineAdmin.Models;

namespace eMedicineAdmin.Controllers
{
    public class OrderController : Controller
    {
        private readonly HttpClient _httpClient;


        public OrderController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("eMedicineClient");
        }
        public IActionResult UIEntryOrder()
        {
            string menuDataJson = HttpContext.Session.GetString("MenuData");
            var menuLists = string.IsNullOrEmpty(menuDataJson)
                ? new List<MenuViewModel>()
                : JsonConvert.DeserializeObject<List<MenuViewModel>>(menuDataJson);

            ViewBag.MenuData = menuLists;
            return View();
        }
        public IActionResult UIOrderList()
        {
            string menuDataJson = HttpContext.Session.GetString("MenuData");
            var menuLists = string.IsNullOrEmpty(menuDataJson)
                ? new List<MenuViewModel>()
                : JsonConvert.DeserializeObject<List<MenuViewModel>>(menuDataJson);

            ViewBag.MenuData = menuLists;
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
            HttpResponseMessage response = await _httpClient.PostAsync(_httpClient.BaseAddress + "OrderAPI/SaveOrders", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Order create Successfully" });
            }

            ModelState.AddModelError("", "Unable to create one or more orders. Please try again.");
            return Json(new { success = false, message = "Failed to save orders." });
        }     

        [HttpPost]
        public async Task<JsonResult> GetItems(string item)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}OrderAPI/GetItems/{item}");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Item. Please try again later." });
                }

                var responseData = await response.Content.ReadAsStringAsync();

                if (JsonConvert.DeserializeObject<ItemViewModel>(responseData) is { } Item && Item.Data != null)
                {
                    return Json(new { success = true, data = Item.Data.FirstOrDefault() });
                }

                if (JsonConvert.DeserializeObject<List<ItemViewModel>>(responseData) is { } Items)
                {
                    return Json(new { success = true, data = Items.FirstOrDefault() });
                }

                return Json(new { success = false, message = "Item data is not in the expected format." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        public async Task<JsonResult> GetAllItem()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}OrderAPI/GetAllOrders");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Item List. Please try again later." });
                }

                var responseData = JsonConvert.DeserializeObject<OrderListViewModel>(await response.Content.ReadAsStringAsync());

                if (responseData?.Success == true && responseData.Data != null)
                {
                    return Json(new { success = true, data = responseData.Data });
                }

                return Json(new { success = false, message = "Item List is empty or could not be loaded." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        public async Task<JsonResult> GetDetailsByOrderID(string OrderId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}OrderAPI/GetDetailsByOrderID/{OrderId}");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Item. Please try again later." });
                }

                var responseData = await response.Content.ReadAsStringAsync();

                if (JsonConvert.DeserializeObject<OrderListViewModel>(responseData) is { } Item && Item.Data != null)
                {
                    return Json(new { success = true, data = Item.Data.FirstOrDefault() });
                }

                if (JsonConvert.DeserializeObject<List<OrderListViewModel>>(responseData) is { } Items)
                {
                    return Json(new { success = true, data = Items.FirstOrDefault() });
                }

                return Json(new { success = false, message = "Item data is not in the expected format." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<JsonResult> SaveOrderItem([FromBody] OrderViewModel OrderItem)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid Order Item data." });
            }

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(OrderItem), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}OrderAPI/SaveOrderItem", content);

                return response.IsSuccessStatusCode
                    ? Json(new { success = true, message = "Order Item created successfully." })
                    : Json(new { success = false, message = "Failed to create Order Item. Please try again." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        public ActionResult ChangeStatusByOrderID(string OrderId, string statusType)
        {
            bool status = false;
            try
            {
                HttpResponseMessage response = _httpClient.GetAsync(_httpClient.BaseAddress + $"/ChangeStatusByOrderID/{OrderId}/{statusType}").Result;

                if (response.IsSuccessStatusCode)
                {
                    status = true;

                }
            }
            catch (JsonSerializationException)
            {
                status = false;
            }
            return Json(new { status});
            
        }
    }
}
