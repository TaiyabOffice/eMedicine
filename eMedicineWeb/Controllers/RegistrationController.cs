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

        [HttpPost]
        public async Task<ActionResult> CreateRegistration(RegistrationViewModel Registration)
        {

            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Registration details." });
            }
            string data = JsonConvert.SerializeObject(Registration);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateRegistration", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Registration create Successfully" });
            }
            ModelState.AddModelError("", "Unable to create Registration. Please try again.");
            return Json(new { success = false, message = "Failed to retrieve Registration details." });
        }


    }
}