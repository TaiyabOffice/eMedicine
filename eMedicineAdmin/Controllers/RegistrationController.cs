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

        [HttpPost]
        public ActionResult UpdateUserById(string UserId, string isActive)
        {
            bool status = false;
            try
            {
                string requestUrl = $"{_httpClient.BaseAddress}RegistrationAPI/UpdateUserById?UserId={Uri.EscapeDataString(UserId)}&isActive={Uri.EscapeDataString(isActive)}";

                HttpResponseMessage response = _httpClient.GetAsync(requestUrl).Result;

                if (response.IsSuccessStatusCode)
                {
                    status = true;

                }
            }
            catch (JsonSerializationException)
            {
                status = false;
            }

            //return Json(status, JsonRequestBehavior.AllowGet);
            return Json(new { status, message = "User Update Successfully" });
        }

        [HttpPost]
        public ActionResult RecoverPassword(string PhoneNumber, string UserPass)
        {
            bool status = false;
            try
            {
                string requestUrl = $"{_httpClient.BaseAddress}RegistrationAPI/RecoverPassword?PhoneNumber={Uri.EscapeDataString(PhoneNumber)}&UserPass={Uri.EscapeDataString(UserPass)}";

                HttpResponseMessage response = _httpClient.GetAsync(requestUrl).Result;
                string data = response.Content.ReadAsStringAsync().Result;
                var loginResponse = JsonConvert.DeserializeObject<RegistrationViewModel>(data);
                if (loginResponse.Success)
                {
                    status = true;
                }
                else
                {
                    status = false;                    
                    return Json(new { success = false, message = "User Update Failed" });
                }

            }
            catch (JsonSerializationException)
            {
                status = false;
            }

            return Json(new { success = true, RedirectUrl = Url.Action("Login", "Login") });
        }

    }
}
