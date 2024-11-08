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
        HttpClient client;        
        public CompanyController()
        {
            client = new HttpClient();
            client.BaseAddress = baseAddress;
        }
        public ActionResult UIEntryCompany()
        {
            return View();
        }
        public async Task<JsonResult> GetAllCompany()
        {
            List<CompanyViewModel> companyList = new List<CompanyViewModel>();
            try
            {
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetAllCompany");
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();

                    if (!string.IsNullOrEmpty(data))
                    {
                        companyList = JsonConvert.DeserializeObject<List<CompanyViewModel>>(data);
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Failed to retrieve companies. Please try again later." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }

            return Json(new { success = true, data = companyList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<ActionResult> CreateCompany(CompanyViewModel company)
        {   bool Satus = false;
            if (!ModelState.IsValid)
            {
                return View(company);
            }
            string data = JsonConvert.SerializeObject(company);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateCompany", content);
            if (response.IsSuccessStatusCode)
            {
                return View(Satus = true);
            }            
            ModelState.AddModelError("", "Unable to create company. Please try again.");
            return View(company);
        }
        [HttpPost] 
        public async Task<JsonResult> GetCompanyById(string companyId)
        {
            CompanyViewModel company = null;
            try
            {
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetCompanyById/" + companyId);

                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();

                    try
                    {
                        // Attempt to deserialize the single company object
                        company = JsonConvert.DeserializeObject<CompanyViewModel>(data);
                    }
                    catch (JsonSerializationException)
                    {
                        // If deserialization fails, try to handle as a list and get the first one
                        var companies = JsonConvert.DeserializeObject<List<CompanyViewModel>>(data);
                        company = companies.FirstOrDefault();
                    }

                    if (company != null)
                    {
                        return Json(new { success = true, data01 = new List<CompanyViewModel> { company } });
                    }
                }

                // If the request was unsuccessful or no company was found
                return Json(new { success = false, message = "Failed to retrieve company details." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<ActionResult> UpdateCompanyById(CompanyViewModel company)
        {
            if (!ModelState.IsValid)
            {
                return View(company);
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