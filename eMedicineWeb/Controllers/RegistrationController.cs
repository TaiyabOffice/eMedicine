using eMedicineWeb.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace eMedicineWeb.Controllers
{
    // [AllowAnonymous]
    public class RegistrationController : Controller
    {
        // GET: Registration
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"] + "RegistrationAPI");
        HttpClient client;
        public RegistrationController()
        {
            client = new HttpClient();
            client.BaseAddress = baseAddress;

        }
        public ActionResult UIEntryRegister()
        {
            return View();
        }

        public ActionResult UIUserList()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> CreateRegistration(RegistrationViewModel objDetails)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Registration details." });
            }
            string data = JsonConvert.SerializeObject(objDetails);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateRegistration", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Registration create Successfully", RedirectUrl = Url.Action("Login", "Login") });

            }
            ModelState.AddModelError("", "Unable to create Registration. Please try again.");
            return Json(new { success = false, message = "Failed to retrieve Registration details." });
        }

        public async Task<ActionResult> GetAllUser()
        {
            List<RegistrationViewModel> userList = new List<RegistrationViewModel>();

            try
            {
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetAllUser");

                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<RegistrationResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            userList = Response?.Data ?? new List<RegistrationViewModel>();
                        }
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Failed to retrieve User. Please try again later." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { success = true, data = userList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult UpdateUserById(string UserId, string isActive)
        {
            bool status = false;
            try
            {
                string requestUrl = $"{client.BaseAddress}/UpdateUserById?UserId={Uri.EscapeDataString(UserId)}&isActive={Uri.EscapeDataString(isActive)}";

                HttpResponseMessage response = client.GetAsync(requestUrl).Result;

                if (response.IsSuccessStatusCode)
                {
                    status = true;

                }                
            }
            catch (JsonSerializationException)
            {
                status = false;
            }

            return Json(status, JsonRequestBehavior.AllowGet);
        }

        public ActionResult UIRecoverPassword()
        {
            return View();
        }

        [HttpPost]
        public ActionResult RecoverPassword(string PhoneNumber, string UserPass)
        {
            bool status = false;
            try
            {
                string requestUrl = $"{client.BaseAddress}/RecoverPassword?PhoneNumber={Uri.EscapeDataString(PhoneNumber)}&isActive={Uri.EscapeDataString(UserPass)}";

                HttpResponseMessage response = client.GetAsync(requestUrl).Result;

                if (response.IsSuccessStatusCode)
                {
                    status = true;

                }
            }
            catch (JsonSerializationException)
            {
                status = false;
            }

            return Json(status, JsonRequestBehavior.AllowGet);
        }
    }
}