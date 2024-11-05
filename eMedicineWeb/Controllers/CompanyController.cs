using eMedicineWeb.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace eMedicineWeb.Controllers
{
    public class CompanyController : Controller
    {
        // GET: Company
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"]+ "CompanyAPI");
        //static string _ServerURL = ConfigurationManager.AppSettings["ServerURL"];
        HttpClient client;
        public CompanyController()
        {
            client = new HttpClient();
            client.BaseAddress = baseAddress;

        }
        public async Task<ActionResult> GetAllCompany()
        {
            List<CompanyViewModal> companyList = new List<CompanyViewModal>();

            try
            {
                // Make the API call asynchronously
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetAllCompany");

                // Check if the response is successful
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();

                    // Deserialize data if it's not null or empty
                    if (!string.IsNullOrEmpty(data))
                    {
                        companyList = JsonConvert.DeserializeObject<List<CompanyViewModal>>(data);
                    }
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Failed to retrieve companies. Please try again later.");
                }
            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging mechanism here)
                ModelState.AddModelError(string.Empty, $"An error occurred: {ex.Message}");
            }

            // Return the view with either the retrieved list or an empty one in case of failure
            return View(companyList);
        }
        public ActionResult CreateCompany()
        {
            return View();
        }

        public ActionResult UIEntryCompany()
        {
            return View();
        }
        [HttpPost]
        public async Task<ActionResult> CreateCompany(CompanyViewModal company)
        {
            if (!ModelState.IsValid)
            {
                return View(company); // Return the view with validation errors
            }

            string data = JsonConvert.SerializeObject(company);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateCompany", content);
            if (response.IsSuccessStatusCode)
            {
                return RedirectToAction("GetAllCompany");
            }

            // Optionally log the error response
            ModelState.AddModelError("", "Unable to create company. Please try again.");
            return View(company); // Return the view with an error message
        }
        public ActionResult GetCompanyById(string companyId)
        {
            CompanyViewModal company = null;
            HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetCompanyById/" + "sadf7").Result;

            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;

                // Try to deserialize as a single object first
                try
                {
                    company = JsonConvert.DeserializeObject<CompanyViewModal>(data);
                }
                catch (JsonSerializationException)
                {
                    // If it fails, try to deserialize as a list
                    var companies = JsonConvert.DeserializeObject<List<CompanyViewModal>>(data);
                    company = companies.FirstOrDefault();
                }
            }

            return View(company);
        }
        public ActionResult UpdateCompanyById()
        {
            return View();
        }
        [HttpPost]
        public async Task<ActionResult> UpdateCompanyById(CompanyViewModal company)
        {
            if (!ModelState.IsValid)
            {
                return View(company); // Return the view with validation errors
            }

            string data = JsonConvert.SerializeObject(company);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/UpdateCompanyById", content);
            if (response.IsSuccessStatusCode)
            {
                return RedirectToAction("GetAllCompany");
            }
            ModelState.AddModelError("", "Unable to create company. Please try again.");
            return View(company);
        }

    }
}