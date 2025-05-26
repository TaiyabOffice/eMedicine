using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using eMedicineAdmin.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace eMedicineAdmin.Controllers
{
    public class SupplierController : Controller
    {
        private readonly HttpClient _httpClient;

        public SupplierController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("eMedicineClient");
        }
        public IActionResult UIEntrySupplier()
        {
            string menuDataJson = HttpContext.Session.GetString("MenuData");
            var menuLists = string.IsNullOrEmpty(menuDataJson)
                ? new List<MenuViewModel>()
                : JsonConvert.DeserializeObject<List<MenuViewModel>>(menuDataJson);

            ViewBag.MenuData = menuLists;
            return View();
        }
        public async Task<JsonResult> GetAllSupplier()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}SupplierAPI/GetAllSupplier");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Supplier List. Please try again later." });
                }

                var responseData = JsonConvert.DeserializeObject<SupplierViewModel>(await response.Content.ReadAsStringAsync());

                if (responseData?.Success == true && responseData.Data != null)
                {
                    return Json(new { success = true, data = responseData.Data });
                }

                return Json(new { success = false, message = "Supplier List is empty or could not be loaded." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<JsonResult> CreateSupplier([FromBody] SupplierViewModel supplier)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid supplier data." });
            }

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(supplier), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}SupplierAPI/CreateSupplier", content);

                return response.IsSuccessStatusCode
                    ? Json(new { success = true, message = "Supplier created successfully." })
                    : Json(new { success = false, message = "Failed to create supplier. Please try again." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetSupplierById(string SupplierId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}SupplierAPI/GetSupplierById/{SupplierId}");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Supplier. Please try again later." });
                }

                var responseData = await response.Content.ReadAsStringAsync();
               
                if (JsonConvert.DeserializeObject<SupplierViewModel>(responseData) is { } supplier && supplier.Data != null)
                {
                    return Json(new { success = true, data = supplier.Data.FirstOrDefault() });
                }
               
                if (JsonConvert.DeserializeObject<List<SupplierViewModel>>(responseData) is { } suppliers)
                {
                    return Json(new { success = true, data = suppliers.FirstOrDefault() });
                }

                return Json(new { success = false, message = "Supplier data is not in the expected format." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<JsonResult> UpdateSupplierById([FromBody] SupplierViewModel supplier)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid supplier details." });
            }

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(supplier), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}SupplierAPI/UpdateSupplierById", content);

                return response.IsSuccessStatusCode
                    ? Json(new { success = true, message = "Supplier updated successfully." })
                    : Json(new { success = false, message = "Failed to update supplier. Please try again." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}
