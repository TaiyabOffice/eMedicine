using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using eMedicineAdmin.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace eMedicineAdmin.Controllers
{
    public class CompanyController : Controller
    {
        private readonly HttpClient _httpClient;

        public CompanyController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("eMedicineClient");
        }
        public IActionResult UIEntryCompany()
        {
            string menuDataJson = HttpContext.Session.GetString("MenuData");
            var menuLists = string.IsNullOrEmpty(menuDataJson)
                ? new List<MenuViewModel>()
                : JsonConvert.DeserializeObject<List<MenuViewModel>>(menuDataJson);

            ViewBag.MenuData = menuLists;
            return View();
        }
        public async Task<JsonResult> GetAllCompany()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}CompanyAPI/GetAllCompany");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Company List. Please try again later." });
                }

                var responseData = JsonConvert.DeserializeObject<CompanyViewModel>(await response.Content.ReadAsStringAsync());

                if (responseData?.Success == true && responseData.Data != null)
                {
                    return Json(new { success = true, data = responseData.Data });
                }

                return Json(new { success = false, message = "Company List is empty or could not be loaded." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<JsonResult> CreateCompany([FromBody] CompanyViewModel Company)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid Company data." });
            }

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(Company), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}CompanyAPI/CreateCompany", content);

                return response.IsSuccessStatusCode
                    ? Json(new { success = true, message = "Company created successfully." })
                    : Json(new { success = false, message = "Failed to create Company. Please try again." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetCompanyById(string CompanyId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}CompanyAPI/GetCompanyById/{CompanyId}");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Company. Please try again later." });
                }

                var responseData = await response.Content.ReadAsStringAsync();

                if (JsonConvert.DeserializeObject<CompanyViewModel>(responseData) is { } Company && Company.Data != null)
                {
                    return Json(new { success = true, data = Company.Data.FirstOrDefault() });
                }

                if (JsonConvert.DeserializeObject<List<CompanyViewModel>>(responseData) is { } Companys)
                {
                    return Json(new { success = true, data = Companys.FirstOrDefault() });
                }

                return Json(new { success = false, message = "Company data is not in the expected format." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<JsonResult> UpdateCompanyById([FromBody] CompanyViewModel Company)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid Company details." });
            }

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(Company), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}CompanyAPI/UpdateCompanyById", content);

                return response.IsSuccessStatusCode
                    ? Json(new { success = true, message = "Company updated successfully." })
                    : Json(new { success = false, message = "Failed to update Company. Please try again." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}
