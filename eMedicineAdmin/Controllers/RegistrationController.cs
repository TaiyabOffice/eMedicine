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
        public async Task<IActionResult> CreateRegistration([FromBody] RegistrationViewModel objDetails)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid registration details." });
            }

            try
            {               
                var data = JsonConvert.SerializeObject(objDetails);
                var content = new StringContent(data, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}RegistrationAPI/CreateRegistration", content);

                if (response.IsSuccessStatusCode)
                {
                    return Json(new
                    {
                        success = true,
                        message = "Registration created successfully.",                       
                    });
                }
               
                return Json(new { success = false, message = "Failed to create registration. Please try again." });
            }
            catch (Exception ex)
            {                
                return Json(new
                {
                    success = false,
                    message = "An error occurred while processing your request.",
                    error = ex.Message
                });
            }
        }

        public async Task<ActionResult> GetAllUser()
        {
            List<RegistrationViewModel> userList = new List<RegistrationViewModel>();
            try
            {
                HttpResponseMessage response = _httpClient.GetAsync(_httpClient.BaseAddress + "RegistrationAPI/GetAllUser").Result;
                if (!response.IsSuccessStatusCode)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Failed to retrieve user List list. Please try again later."
                    });
                }

                string responseData = response.Content.ReadAsStringAsync().Result;
                var dropdownResponse = JsonConvert.DeserializeObject<RegistrationViewModel>(responseData);
                if (dropdownResponse?.Success == true)
                {
                    userList = dropdownResponse.Data ?? new List<RegistrationViewModel>();
                }
                else
                {
                    return Json(new
                    {
                        success = false,
                        message = "user List list is empty or could not be loaded."
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = $"An error occurred: {ex.Message}"
                });
            }
            return Json(new { success = true, data = userList });
        }

    }
}
