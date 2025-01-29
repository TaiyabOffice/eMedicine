using eMedicineAdmin.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace eMedicineAdmin.Controllers
{
    public class RegistrationController : Controller
    {
        private readonly HttpClient _httpClient;

        public RegistrationController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("eMedicineClient");
        }
        public IActionResult UIEntryRegister()
        {
            return View();
        }
        public IActionResult UIUserList()
        {
            return View();
        }
        public IActionResult UIUserList1()
        {
            return View();
        }
        public IActionResult UIRecoverPassword()
        {
            return View();
        }
        
        [HttpPost]
        public async Task<JsonResult> CreateRegistration([FromBody] RegistrationViewModel objDetails)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid registration details." });
            }

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(objDetails), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}RegistrationAPI/CreateRegistration", content);

                return Json(new
                {
                    success = response.IsSuccessStatusCode,
                    message = response.IsSuccessStatusCode
                        ? "Registration created successfully."
                        : "Failed to create registration. Please try again."
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        public async Task<JsonResult> GetAllUser()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}RegistrationAPI/GetAllUser");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve user list. Please try again later." });
                }

                var responseData = await response.Content.ReadAsStringAsync();
                var dropdownResponse = JsonConvert.DeserializeObject<RegistrationViewModel>(responseData);

                if (dropdownResponse?.Success == true && dropdownResponse.Data != null)
                {
                    return Json(new { success = true, data = dropdownResponse.Data });
                }

                return Json(new { success = false, message = "User list is empty or could not be loaded." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<JsonResult> UpdateUserById(string userId, string isActive)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(isActive))
            {
                return Json(new { success = false, message = "Invalid parameters." });
            }

            try
            {
                string requestUrl = $"{_httpClient.BaseAddress}RegistrationAPI/UpdateUserById?UserId={Uri.EscapeDataString(userId)}&isActive={Uri.EscapeDataString(isActive)}";
                var response = await _httpClient.GetAsync(requestUrl);

                return response.IsSuccessStatusCode
                    ? Json(new { success = true, message = "User updated successfully." })
                    : Json(new { success = false, message = "Failed to update user. Please try again." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<JsonResult> RecoverPassword(string phoneNumber, string userPass)
        {
            if (string.IsNullOrEmpty(phoneNumber) || string.IsNullOrEmpty(userPass))
            {
                return Json(new { success = false, message = "Invalid parameters." });
            }

            try
            {
                string requestUrl = $"{_httpClient.BaseAddress}RegistrationAPI/RecoverPassword?PhoneNumber={Uri.EscapeDataString(phoneNumber)}&UserPass={Uri.EscapeDataString(userPass)}";
                var response = await _httpClient.GetAsync(requestUrl);

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "User update failed." });
                }

                var responseData = await response.Content.ReadAsStringAsync();
                var loginResponse = JsonConvert.DeserializeObject<RegistrationViewModel>(responseData);

                if (loginResponse?.Success == true)
                {
                    return Json(new { success = true, redirectUrl = Url.Action("Login", "Login") });
                }

                return Json(new { success = false, message = "User update failed." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}
