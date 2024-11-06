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
        public async Task<ActionResult> GetAllCompany()
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
                    ModelState.AddModelError(string.Empty, "Failed to retrieve companies. Please try again later.");
                }
            }
            catch (Exception ex)
            {               
                ModelState.AddModelError(string.Empty, $"An error occurred: {ex.Message}");
            }            
            return View(companyList);
        }            
        [HttpPost]
        public async Task<ActionResult> CreateCompany(CompanyViewModel company)
        {
            if (!ModelState.IsValid)
            {
                return View(company);
            }
            string data = JsonConvert.SerializeObject(company);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateCompany", content);
            if (response.IsSuccessStatusCode)
            {
                return RedirectToAction("GetAllCompany");
            }            
            ModelState.AddModelError("", "Unable to create company. Please try again.");
            return View(company);
        }
        public ActionResult GetCompanyById(string companyId)
        {
            CompanyViewModel company = null;
            HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetCompanyById/" + companyId).Result;

            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;                
                try
                {
                    company = JsonConvert.DeserializeObject<CompanyViewModel>(data);
                }
                catch (JsonSerializationException)
                {                    
                    var companies = JsonConvert.DeserializeObject<List<CompanyViewModel>>(data);
                    company = companies.FirstOrDefault();
                }
            }
            return View(company);
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