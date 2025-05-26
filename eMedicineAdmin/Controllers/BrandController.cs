using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using eMedicineAdmin.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;
namespace eMedicineAdmin.Controllers
{
    public class BrandController : Controller
    {
        private readonly HttpClient _httpClient;

        public BrandController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("eMedicineClient");
        }
        public IActionResult UIEntryBrand()
        {
            string menuDataJson = HttpContext.Session.GetString("MenuData");
            var menuLists = string.IsNullOrEmpty(menuDataJson)
                ? new List<MenuViewModel>()
                : JsonConvert.DeserializeObject<List<MenuViewModel>>(menuDataJson);

            ViewBag.MenuData = menuLists;
            return View();
        }
        public async Task<JsonResult> GetAllBrand()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}BrandAPI/GetAllBrand");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Brand List. Please try again later." });
                }

                var responseData = JsonConvert.DeserializeObject<BrandViewModel>(await response.Content.ReadAsStringAsync());

                if (responseData?.Success == true && responseData.Data != null)
                {
                    return Json(new { success = true, data = responseData.Data });
                }

                return Json(new { success = false, message = "Brand List is empty or could not be loaded." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<JsonResult> CreateBrand([FromBody] BrandViewModel Brand)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid Brand data." });
            }

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(Brand), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}BrandAPI/CreateBrand", content);

                return response.IsSuccessStatusCode
                    ? Json(new { success = true, message = "Brand created successfully." })
                    : Json(new { success = false, message = "Failed to create Brand. Please try again." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetBrandById(string BrandId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}BrandAPI/GetBrandById/{BrandId}");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Brand. Please try again later." });
                }

                var responseData = await response.Content.ReadAsStringAsync();

                if (JsonConvert.DeserializeObject<BrandViewModel>(responseData) is { } Brand && Brand.Data != null)
                {
                    return Json(new { success = true, data = Brand.Data.FirstOrDefault() });
                }

                if (JsonConvert.DeserializeObject<List<BrandViewModel>>(responseData) is { } Brands)
                {
                    return Json(new { success = true, data = Brands.FirstOrDefault() });
                }

                return Json(new { success = false, message = "Brand data is not in the expected format." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<JsonResult> UpdateBrandById([FromBody] BrandViewModel Brand)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid Brand details." });
            }

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(Brand), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}BrandAPI/UpdateBrandById", content);

                return response.IsSuccessStatusCode
                    ? Json(new { success = true, message = "Brand updated successfully." })
                    : Json(new { success = false, message = "Failed to update Brand. Please try again." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}
