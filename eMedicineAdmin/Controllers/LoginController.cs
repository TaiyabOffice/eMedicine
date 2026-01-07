using eMedicineAdmin.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Sockets;
using System.Net;
using System.Net.Http;
using Microsoft.AspNetCore.Http;
using System.Data;

namespace eMedicineAdmin.Controllers
{
    public class LoginController : Controller
    {
        private readonly HttpClient _httpClient;

        public LoginController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("eMedicineClient");
        }
        public ActionResult Login()
        {
           
            return View();
        }       
        [HttpPost]
        public async Task<IActionResult> LoginData(string UserName, string Password) {                           

            try
            {                
                var requestUrl = $"{_httpClient.BaseAddress}LoginAPI/LogIn?UserName={Uri.EscapeDataString(UserName)}&UserPassword={Uri.EscapeDataString(Password)}";
                               
                var response = await _httpClient.GetAsync(requestUrl);
                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Invalid credentials or server error." });
                }
                
                var data = await response.Content.ReadAsStringAsync();
                var loginResponse = JsonConvert.DeserializeObject<LoginViewModel>(data);
                var loginModel = loginResponse?.Data?.FirstOrDefault();

                if (loginModel == null)
                {
                    return Json(new { success = false, message = "Login failed. User data not found." });
                }
                
                HttpContext.Session.SetString("UserID", loginModel.UserId);
                HttpContext.Session.SetString("UserName", loginModel.UserName);
                HttpContext.Session.SetString("Email", loginModel.Email);
                HttpContext.Session.SetString("PhoneNumber", loginModel.PhoneNumber);
                HttpContext.Session.SetString("DateToday", DateTime.Now.ToString("dd-MM-yyyy"));
                
                var menuResponse = await _httpClient.GetAsync($"{_httpClient.BaseAddress}LoginAPI/GetMenuById/{Uri.EscapeDataString(UserName)}");
                if (!menuResponse.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Login successful, but menu data could not be retrieved." });
                }

                var menuData = await menuResponse.Content.ReadAsStringAsync();
                var menuRes = JsonConvert.DeserializeObject<MenuViewModel>(menuData);
                var menuLists = menuRes?.Data ?? new List<MenuViewModel>();

                HttpContext.Session.SetString("MenuData", JsonConvert.SerializeObject(menuLists));
                //ViewBag.MenuData = JsonConvert.SerializeObject(menuLists);

                return Json(new { success = true, message = "Login successful." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred during login.", error = ex.Message });
            }
        }


    }
}
