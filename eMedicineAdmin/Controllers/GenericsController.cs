using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using eMedicineAdmin.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace eMedicineAdmin.Controllers
{
    public class GenericsController : Controller
    {
        private readonly HttpClient _httpClient;
        public GenericsController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("eMedicineClient");
        }
        public IActionResult UIEntryGenerics()
        {
            string menuDataJson = HttpContext.Session.GetString("MenuData");
            var menuLists = string.IsNullOrEmpty(menuDataJson)
                ? new List<MenuViewModel>()
                : JsonConvert.DeserializeObject<List<MenuViewModel>>(menuDataJson);

            ViewBag.MenuData = menuLists;
            return View();
        }        
        public async Task<JsonResult> GetAllGenerics()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}GenericsAPI/GetAllGenerics");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Generics List. Please try again later." });
                }

                var responseData = JsonConvert.DeserializeObject<GenericsViewModel>(await response.Content.ReadAsStringAsync());

                if (responseData?.Success == true && responseData.Data != null)
                {
                    return Json(new { success = true, data = responseData.Data });
                }

                return Json(new { success = false, message = "Generics List is empty or could not be loaded." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<JsonResult> CreateGenerics([FromBody] GenericsViewModel Generics)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid Generics data." });
            }

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(Generics), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}GenericsAPI/CreateGenerics", content);

                return response.IsSuccessStatusCode
                    ? Json(new { success = true, message = "Generics created successfully." })
                    : Json(new { success = false, message = "Failed to create Generics. Please try again." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetGenericsById(string GenericsId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}GenericsAPI/GetGenericsById/{GenericsId}");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Generics. Please try again later." });
                }

                var responseData = await response.Content.ReadAsStringAsync();

                if (JsonConvert.DeserializeObject<GenericsViewModel>(responseData) is { } Generics && Generics.Data != null)
                {
                    return Json(new { success = true, data = Generics.Data.FirstOrDefault() });
                }

                if (JsonConvert.DeserializeObject<List<GenericsViewModel>>(responseData) is { } Genericss)
                {
                    return Json(new { success = true, data = Genericss.FirstOrDefault() });
                }

                return Json(new { success = false, message = "Generics data is not in the expected format." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<JsonResult> UpdateGenericsById([FromBody] GenericsViewModel Generics)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid Generics details." });
            }

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(Generics), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}GenericsAPI/UpdateGenericsById", content);

                return response.IsSuccessStatusCode
                    ? Json(new { success = true, message = "Generics updated successfully." })
                    : Json(new { success = false, message = "Failed to update Generics. Please try again." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}
