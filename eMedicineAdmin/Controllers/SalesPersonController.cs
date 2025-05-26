using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using eMedicineAdmin.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Text;
namespace eMedicineAdmin.Controllers
{
    public class SalesPersonController : Controller
    {
        private readonly HttpClient _httpClient;

        public SalesPersonController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("eMedicineClient");
        }
        public IActionResult UIEntrySalesPerson()
        {
            string menuDataJson = HttpContext.Session.GetString("MenuData");
            var menuLists = string.IsNullOrEmpty(menuDataJson)
                ? new List<MenuViewModel>()
                : JsonConvert.DeserializeObject<List<MenuViewModel>>(menuDataJson);

            ViewBag.MenuData = menuLists;
            return View();
        }
        public async Task<JsonResult> GetAllSalesPerson()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}SalesPersonAPI/GetAllSalesPerson");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve SalesPerson List. Please try again later." });
                }

                var responseData = JsonConvert.DeserializeObject<SalesPersonViewModel>(await response.Content.ReadAsStringAsync());

                if (responseData?.Success == true && responseData.Data != null)
                {
                    return Json(new { success = true, data = responseData.Data });
                }

                return Json(new { success = false, message = "SalesPerson List is empty or could not be loaded." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<JsonResult> CreateSalesPerson([FromBody] SalesPersonViewModel SalesPerson)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid SalesPerson data." });
            }

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(SalesPerson), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}SalesPersonAPI/CreateSalesPerson", content);

                return response.IsSuccessStatusCode
                    ? Json(new { success = true, message = "SalesPerson created successfully." })
                    : Json(new { success = false, message = "Failed to create SalesPerson. Please try again." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetSalesPersonById(string SalesPersonId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}SalesPersonAPI/GetSalesPersonById/{SalesPersonId}");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve SalesPerson. Please try again later." });
                }

                var responseData = await response.Content.ReadAsStringAsync();

                if (JsonConvert.DeserializeObject<SalesPersonViewModel>(responseData) is { } SalesPerson && SalesPerson.Data != null)
                {
                    return Json(new { success = true, data = SalesPerson.Data.FirstOrDefault() });
                }

                if (JsonConvert.DeserializeObject<List<SalesPersonViewModel>>(responseData) is { } SalesPersons)
                {
                    return Json(new { success = true, data = SalesPersons.FirstOrDefault() });
                }

                return Json(new { success = false, message = "SalesPerson data is not in the expected format." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<JsonResult> UpdateSalesPersonById([FromBody] SalesPersonViewModel SalesPerson)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid SalesPerson details." });
            }

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(SalesPerson), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}SalesPersonAPI/UpdateSalesPersonById", content);

                return response.IsSuccessStatusCode
                    ? Json(new { success = true, message = "SalesPerson updated successfully." })
                    : Json(new { success = false, message = "Failed to update SalesPerson. Please try again." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}
