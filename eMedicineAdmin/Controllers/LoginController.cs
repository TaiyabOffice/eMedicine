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
        public JsonResult Login([FromBody] LoginViewModel loginData)
        {
            LoginViewModel loginModel = null;
            if (loginData == null || string.IsNullOrEmpty(loginData.UserName) || string.IsNullOrEmpty(loginData.UserPassword))
            {
                return Json(new { success = false, message = "Login failed. Please check your credentials." });
            }
            try
            {
                string requestUrl = $"{_httpClient.BaseAddress}LoginAPI/LogIn?UserName={Uri.EscapeDataString(loginData.UserName)}&UserPassword={Uri.EscapeDataString(loginData.UserPassword)}";
                HttpResponseMessage response = _httpClient.GetAsync(requestUrl).Result;

                if (response.IsSuccessStatusCode)
                {
                    string data = response.Content.ReadAsStringAsync().Result;
                    var loginResponse = JsonConvert.DeserializeObject<LoginViewModel>(data);
                    List<LoginViewModel> loginViewModels = loginResponse?.Data ?? new List<LoginViewModel>();
                    loginModel = loginViewModels.FirstOrDefault();
                    HttpContext.Session.SetString("UserID", loginModel.UserId);
                    HttpContext.Session.SetString("UserName", loginModel.UserName);
                    HttpContext.Session.SetString("Email", loginModel.Email);
                    HttpContext.Session.SetString("PhoneNumber", loginModel.PhoneNumber);
                    HttpContext.Session.SetString("DateToday", DateTime.Now.ToString("dd-MM-yyyy"));

                    HttpResponseMessage MenuResponse = _httpClient.GetAsync(_httpClient.BaseAddress + "LoginAPI/GetMenuById/" + loginData.UserName).Result;
                    if (MenuResponse.IsSuccessStatusCode)
                    {
                        string Menudata = MenuResponse.Content.ReadAsStringAsync().Result;
                        var MenuRes = JsonConvert.DeserializeObject<MenuViewModel>(Menudata);
                        List<MenuViewModel> menuLists = MenuRes?.Data ?? new List<MenuViewModel>();
                        HttpContext.Session.SetString("MenuData", JsonConvert.SerializeObject(menuLists));
                        //ViewBag.MenuData = menuLists;
                        return Json(new { success = true, message = "Login successful." });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Login failed. Please check your credentials." });
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Login failed. Please check your credentials." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred during login.", error = ex.Message });
            }
        }

    }
}
